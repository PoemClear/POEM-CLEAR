<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="定时发布"
    :helpMessage="['请选择当前时间后 4小时 至 7天 进行定时发布']"
    @visible-change="handleVisibleChange"
  >
    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm" :model="model" />
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';

  const schemas: FormSchema[] = [
    {
      field: 'date',
      component: 'DatePicker',
      label: '选择日期',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'time',
      component: 'TimePicker',
      defaultValue: '',
      label: '选择时间',
      colProps: {
        span: 12,
      },
    },
  ];
  export default defineComponent({
    components: { BasicModal, BasicForm },
    props: {
      userData: { type: Object },
    },
    setup(props) {
      const modelRef = ref({});
      const [
        registerForm,
        {
          // setFieldsValue,
          // setProps
        },
      ] = useForm({
        labelWidth: 80,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });

      const [register] = useModalInner((data) => {
        data && onDataReceive(data);
      });

      function onDataReceive(data) {
        console.log('Data Received', data);
        // 方式1;
        // setFieldsValue({
        //   field2: data.data,
        //   field1: data.info,
        // });

        // // 方式2
        modelRef.value = { date: data.date, time: data.time };

        // setProps({
        //   model:{ field2: data.data, field1: data.info }
        // })
      }

      console.log(modelRef);

      function handleVisibleChange(v) {
        v && props.userData && nextTick(() => onDataReceive(props.userData));
      }

      return { register, schemas, registerForm, model: modelRef, handleVisibleChange };
    },
  });
</script>
