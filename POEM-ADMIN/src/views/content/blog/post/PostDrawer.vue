<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="90%"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'menuName', key: 'id' }"
          checkable
          toolbar
          title="菜单分配"
        />
      </template>
    </BasicForm>
    <template #insertFooter>
      <a-button> 切换编辑器</a-button>
    </template>
    <template #centerFooter>
      <a-button> btn2</a-button>
    </template>

    <template #appendFooter>
      <a-button> btn3</a-button>
    </template>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, reactive, computed } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './post.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { useUserStore } from '/@/store/modules/user';
  import { createPost, updatePost } from '/@/api/content/blog';

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData = ref<TreeItem[]>([]);

      const userStore = useUserStore();
      const userinfo = computed(() => userStore.getUserInfo);
      console.log(userinfo.value.id);
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
          // TODO custom api
          console.log(values);
          console.log(isUpdate.value);
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
        treeData,
      };
    },
  });
</script>
