<template>
  <div>
    <PageWrapper title="【MarkDown编辑器】写文章" contentBackground @back="goBack">
      <CollapseContainer title="创作合格质量的文章">
        <BasicForm
          :labelWidth="100"
          :schemas="schemas"
          :actionColOptions="{ span: 24 }"
          :baseColProps="{ span: 24 }"
          @submit="handleSubmit"
        />
      </CollapseContainer>
    </PageWrapper>
    <!-- <WriteDrawer @register="registerDrawer" @success="handleSuccess" /> -->
  </div>
</template>
<script lang="ts">
  import { defineComponent, h, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { MarkDown } from '/@/components/Markdown';
  import { CollapseContainer } from '/@/components/Container/index';
  import { BasicForm, FormSchema } from '/@/components/Form/index';
  // import WriteDrawer from './WriteDrawer.vue';
  import { uploadApi } from '/@/api/sys/upload';
  import { useMessage } from '/@/hooks/web/useMessage';
  // import { useDrawer } from '/@/components/Drawer';
  import { useGo } from '/@/hooks/web/usePage';
  import { getPostCateList, createPost } from '/@/api/content/blog';
  const schemas: FormSchema[] = [
    {
      field: 'title',
      component: 'Input',
      label: '标题',
      defaultValue: '请输入文章标题 (5~100个字)',
      rules: [{ required: true }],
    },
    {
      field: 'content',
      component: 'Input',
      label: '内容',
      defaultValue: '请输入内容',
      rules: [{ required: true, trigger: 'blur' }],
      render: ({ model, field }) => {
        return h(MarkDown, {
          value: model[field],
          onChange: (value: string) => {
            model[field] = value;
          },
        });
      },
    },
    {
      field: 'cover',
      component: 'Upload',
      label: '上传封面',
      rules: [{ required: false, message: '请选择上传封面' }],
      componentProps: {
        api: uploadApi,
        maxSize: 20,
        maxNumber: 1,
      },
      colProps: { span: 8 },
    },
    {
      field: 'cateId',
      component: 'ApiCascader',
      rules: [{ required: false, message: '请选择文章分类' }],
      label: '分类',
      colProps: {
        span: 8,
      },
      componentProps: {
        api: getPostCateList,
        apiParamKey: 'parentId',
        dataField: 'data',
        labelField: 'title',
        valueField: 'id',
        initFetchParams: {
          parentId: '',
        },
        isLeaf: (record) => {
          return !(record.type < 1);
        },
      },
    },
    {
      field: 'status',
      label: '状态',
      component: 'RadioButtonGroup',
      defaultValue: '1',
      componentProps: {
        options: [
          { label: '启用', value: '1' },
          { label: '停用', value: '0' },
        ],
      },
      colProps: { span: 8 },
    },
    {
      field: 'postType',
      component: 'RadioGroup',
      label: '文章类型',
      defaultValue: '1',
      colProps: {
        span: 8,
      },
      componentProps: {
        options: [
          {
            label: '原创',
            value: '1',
          },
          {
            label: '转载',
            value: '2',
          },
          {
            label: '翻译',
            value: '3',
          },
        ],
      },
    },
    {
      field: 'postFormats',
      component: 'RadioGroup',
      label: '发布形式',
      defaultValue: '1',
      colProps: {
        span: 8,
      },
      componentProps: {
        options: [
          {
            label: '全部可见',
            value: '1',
          },
          {
            label: '仅我可见',
            value: '2',
          },
          {
            label: '粉丝可见',
            value: '3',
          },
          {
            label: 'VIP可见',
            value: '4',
          },
        ],
      },
    },
  ];
  export default defineComponent({
    components: {
      BasicForm,
      CollapseContainer,
      PageWrapper,
    },
    setup() {
      const { createMessage } = useMessage();
      const route = useRoute();
      const go = useGo();
      const id = ref(route.params?.id);
      console.log(id);
      const editorType = ref(route.params?.editorType);
      const value1 = ref<string>('a');
      const subjectList = ref<string[]>([]);
      const timedReleasetValue = ref<string>('0');
      const timedReleaseOptions = ref<Recordable[]>([]);
      timedReleaseOptions.value = [
        { label: '停用', value: '0' },
        { label: '启用', value: '1' },
      ];

      function handleSuccess() {
        // reload();
      }
      async function handleSubmit(values: any) {
        console.log(values);
        let res = await createPost(values);
        console.log(res);
        createMessage.success('click search,values:' + JSON.stringify(values));
      }

      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/blog/post');
      }
      return {
        schemas,
        // registerDrawer,
        handleSuccess,
        handleSubmit,
        value1,
        editorType,
        goBack,
        subjectList,
        timedReleasetValue,
        id,
      };
    },
  });
</script>
