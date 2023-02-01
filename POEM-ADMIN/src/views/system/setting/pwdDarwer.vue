<template>
  <BasicModal
    title="修改当前用户密码"
    content="修改成功后会自动退出当前登录！"
    @ok="handleSubmit"
    @close="resetFields"
    @register="registerModal"
  >
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <!-- <div class="flex justify-center">
        <a-button @click="resetFields"> 重置 </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
      </div> -->
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { updatePwd } from '/@/api/setting';
  import { formSchema } from './pwd.data';
  export default defineComponent({
    name: 'ChangePassword',
    components: { BasicForm, BasicModal },
    setup() {
      const isUpdate = ref(true);
      const [register, { validate, resetFields }] = useForm({
        size: 'large',
        baseColProps: { span: 24 },
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: formSchema,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        // record = data.record;
        // if (unref(isUpdate)) {
        //   setFieldsValue({
        //     ...data.record,
        //   });
        // }
        // const treeData = await getPosTreeTCateList();
        // updateSchema({
        //   field: 'parentId',
        //   componentProps: { treeData },
        // });
      });
      async function handleSubmit() {
        try {
          const values = await validate();
          // const { passwordOld, passwordNew } = values;
          await updatePwd(values);
          // TODO custom api
          // console.log(passwordOld, passwordNew);
          // const { router } = useRouter();
          // router.push(pageEnum.BASE_LOGIN);
          closeModal();
        } catch (error) {}
      }

      return { register, resetFields, handleSubmit, registerModal };
    },
  });
</script>
