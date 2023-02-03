<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="600px"
    @ok="handleSubmit"
  >
    <!-- <div style="display: flex; align-items: center">
      <div style="width: 90px; text-align: center">上传轮播图</div>
      <BasicUpload
        :maxSize="20"
        :maxNumber="1"
        
        :api="api"
        name="file"
        class="my-5"
        :accept="['image/*']"
    /></div> -->
    <BasicForm @register="registerForm" @submit="handleSubmit">
      <template #remoteSearch="{ model, field }">
        <ApiSelect
          :api="getPostSelectList"
          showSearch
          mode="multiple"
          v-model:value="model[field]"
          :filterOption="false"
          resultField="items"
          labelField="title"
          valueField="id"
          :params="searchParams"
          @search="onSearch"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, reactive } from 'vue';
  import { BasicForm, useForm, ApiSelect } from '/@/components/Form/index';
  import { formSchema } from './post.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useDebounceFn } from '@vueuse/core';
  import { createSubject, updateSubject } from '../../../../api/content/subject';
  import { getPostSelectList } from '/@/api/content/blog';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, ApiSelect },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      let record = reactive({ id: '' });
      const imageList = ref<string[]>([]);
      const userStore = useUserStore();
      const userinfo = computed(() => userStore.getUserInfo);
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });
      const keyword = ref<string>('');
      const searchParams = computed<Recordable>(() => {
        return { title: unref(keyword), pageSize: 1000 };
      });
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        record = data.record;

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        }
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '添加专栏' : '编辑专栏'));
      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api

          if (isUpdate.value) {
            console.log(values);
            await updateSubject({ ...values, id: record.id, userId: userinfo.value.id });
          } else {
            console.log(values);
            await createSubject({ ...values, userId: userinfo.value.id });
          }
          imageList.value = [];
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }
      function onSearch(value: string) {
        keyword.value = value;
      }
      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        searchParams,
        getPostSelectList,
        onSearch: useDebounceFn(onSearch, 300),
        userinfo,
      };
    },
  });
</script>
