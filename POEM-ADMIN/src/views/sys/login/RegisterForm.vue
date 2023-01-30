<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="realName" class="enter-x">
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.realName"
          :placeholder="t('sys.login.realName')"
          :maxlength="20"
        />
      </FormItem>
      <FormItem name="username" class="enter-x">
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.username"
          :placeholder="t('sys.login.userName')"
        />
      </FormItem>
      <FormItem name="phone" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.phone"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
          :maxlength="11"
        />
      </FormItem>
      <FormItem name="deptId" class="enter-x">
        <Select
          v-model:value="formData.deptId"
          :options="areas"
          :placeholder="t('sys.login.deptName')"
        />
      </FormItem>
      <FormItem name="roleValue" class="enter-x">
        <Select
          v-model:value="formData.roleValue"
          :options="roleList"
          :placeholder="t('sys.login.deptName')"
        />
      </FormItem>
      <FormItem name="pwd" class="enter-x">
        <StrengthMeter
          size="large"
          v-model:value="formData.pwd"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <FormItem class="enter-x" name="policy">
        <!-- No logic, you need to deal with it yourself -->
        <Checkbox v-model:checked="formData.policy" size="small">
          {{ t('sys.login.policy') }}
        </Checkbox>
      </FormItem>

      <Button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >
        {{ t('sys.login.registerButton') }}
      </Button>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button, Checkbox, Select } from 'ant-design-vue';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  // import { CountdownInput } from '/@/components/CountDown';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
  import { registerApi } from '/@/api/sys/user';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    username: '',
    pwd: '',
    confirmPassword: '',
    phone: '',
    realName: '',
    policy: false,
    roleValue: 'RegularMembers',
    deptId: '3',
  });
  const areas = [{ label: '会员部', value: '3' }];
  const roleList = [{ label: '普通会员', value: 'RegularMembers' }];
  const { getFormRules } = useFormRules(formData);
  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);

  async function handleRegister() {
    const data = await validForm();
    if (!data) return;
    console.log(data);
    await registerApi(data);
  }
</script>
