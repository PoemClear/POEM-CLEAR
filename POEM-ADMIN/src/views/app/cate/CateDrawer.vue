<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <!-- <div style="display: flex; align-items: center">
      <div style="width: 90px; text-align: center">上传金刚区</div>
      <BasicUpload
        :maxSize="20"
        :maxNumber="1"
        
        :api="api"
        name="file"
        class="my-5"
        :accept="['image/*']"
    /></div> -->
    <BasicForm @register="registerForm" @submit="handleSubmit" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, reactive } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './cate.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  // createBanner
  import { updateAppCate, createAppCate } from '/@/api/app';

  export default defineComponent({
    name: 'CateDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      let record = reactive({ id: '' });
      const imageList = ref<string[]>([]);
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
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
      const getTitle = computed(() => (!unref(isUpdate) ? '新增金刚区' : '编辑金刚区'));
      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api

          if (isUpdate.value) {
            await updateAppCate({ ...values, id: record.id });
          } else {
            await createAppCate({ ...values });
          }
          imageList.value = [];
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }
      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
      };
    },
  });
</script>
