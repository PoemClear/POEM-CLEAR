<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, reactive } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { createMenu, updateMenu } from '/@/api/demo/system';
  import { getPostCateList } from '/@/api/blog';
  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      let record = reactive({ id: '' });
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
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
        const treeData = await getPostCateList();
        console.log(treeData);
        updateSchema({
          field: 'parentId',
          componentProps: { treeData },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api
          if (isUpdate.value) {
            await updateMenu({ ...values, id: record.id });
            console.log('修改');
          } else {
            await createMenu({ ...values });
          }
          console.log(values);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
</script>
