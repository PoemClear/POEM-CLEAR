<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="100%"
    :title="getTitle"
    @ok="handleSubmit"
    ok-text="发布"
  >
    <BasicForm @register="registerForm">
      <template #tag="{ model, field }">
        <a-select
          v-model:value="model[field]"
          mode="tags"
          style="width: 100%"
          :token-separators="[',']"
          placeholder="选择标签"
        />
      </template>
    </BasicForm>
    <template #insertFooter>
      <a-button @click="handleDrafts"> 保存草稿箱</a-button>
    </template>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, reactive } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './post.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useUserStore } from '/@/store/modules/user';
  import { createPost, updatePost } from '/@/api/content/blog';
  import { Select, Alert } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, ASelect: Select, [Alert.name]: Alert },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const userStore = useUserStore();
      const userinfo = computed(() => userStore.getUserInfo);
      const { createMessage } = useMessage();
      let record = reactive({ id: '' });
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        // if (unref(treeData).length === 0) {
        //   treeData.value = (await getMenuList()) as any as TreeItem[];
        // }
        isUpdate.value = !!data?.isUpdate;
        record = data.record;
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增文章' : '编辑文章'));
      console.log(isUpdate);
      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          console.log(values);
          if (!values.label_title) {
            createMessage.info('至少添加一个标签');
            return false;
          }
          // TODO custom api
          values.drafts = 0;
          if (isUpdate.value) {
            await updatePost({ ...values, id: record.id, userId: userinfo.value.id });
          } else {
            await createPost({ ...values, userId: userinfo.value.id });
          }

          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }
      async function handleDrafts() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          if (!values.label_title) {
            createMessage.info('至少添加一个标签');
            return false;
          }
          // TODO custom api
          values.drafts = 1;
          if (isUpdate.value) {
            await updatePost({ ...values, id: record.id, userId: userinfo.value.id });
          } else {
            await createPost({ ...values, userId: userinfo.value.id });
          }

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
        handleDrafts,
      };
    },
  });
</script>
