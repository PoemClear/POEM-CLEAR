<template>
  <CollapseContainer title="基本设置" :canExpan="false">
    <a-row :gutter="24">
      <a-col :span="14">
        <BasicForm @register="register" />
      </a-col>
      <a-col :span="10">
        <div class="change-avatar">
          <div class="mb-2">头像</div>
          <CropperAvatar
            :uploadApi="uploadApi"
            :value="avatar"
            btnText="更换头像"
            :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
            @change="updateAvatar"
            width="150"
          />
        </div>
      </a-col>
    </a-row>
    <Button type="primary" @click="handleSubmit"> 更新基本信息 </Button>
  </CollapseContainer>
</template>
<script lang="ts">
  import { Button, Row, Col } from 'ant-design-vue';
  import { computed, defineComponent, onMounted, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container';
  import { CropperAvatar } from '/@/components/Cropper';
  import { getUserInfo } from '/@/api/sys/user';
  import { baseSetschemas } from './data';
  import { useUserStore } from '/@/store/modules/user';
  import { uploadApi } from '/@/api/sys/upload';
  import { updateUserInfo } from '/@/api/system';
  export default defineComponent({
    components: {
      BasicForm,
      CollapseContainer,
      Button,
      ARow: Row,
      ACol: Col,
      CropperAvatar,
    },
    setup() {
      const userStore = useUserStore();
      const avatarUrl = ref('');
      const [register, { setFieldsValue, validate }] = useForm({
        labelWidth: 120,
        schemas: baseSetschemas,
        showActionButtonGroup: false,
      });

      onMounted(async () => {
        const data = await getUserInfo();
        setFieldsValue(data);
      });

      const avatar = computed(() => {
        const { base64, avatar } = userStore.getUserInfo;
        return avatar || 'data:image/png;base64,' + base64;
      });
      const userinfo = userStore.getUserInfo;
      function updateAvatar({ source, url }) {
        userinfo.avatar = source;
        avatarUrl.value = url;
        userStore.setUserInfo(userinfo);
      }
      async function handleSubmit() {
        try {
          const values = await validate();
          // TODO custom api
          let userInfo = await updateUserInfo({
            ...values,
            avatar: avatarUrl.value || userinfo.avatar,
          });
          userStore.setUserInfo(userInfo);
        } finally {
        }
      }

      return {
        avatar,
        register,
        uploadApi: uploadApi as any,
        updateAvatar,
        handleSubmit,
        avatarUrl,
      };
    },
  });
</script>

<style lang="less" scoped>
  .change-avatar {
    img {
      display: block;
      margin-bottom: 15px;
      border-radius: 50%;
    }
  }
</style>
