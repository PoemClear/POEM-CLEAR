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
        >
          <template #label="{ model, field }">
            <BasicTree
              v-model:value="model[field]"
              toolbar
              :treeData="treeData"
              :fieldNames="{ title: 'title', key: 'id' }"
              checkable
              search
              title=" "
            />
          </template>
        </BasicForm>
      </CollapseContainer>
    </PageWrapper>
    <!-- <WriteDrawer @register="registerDrawer" @success="handleSuccess" /> -->
  </div>
</template>
<script lang="ts">
  import { defineComponent, h, ref, onMounted } from 'vue';
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
  import { getPostCateList, getLabelTreeList, createPost, getPostItem } from '/@/api/blog';
  import { BasicTree, TreeItem } from '/@/components/Tree/index';
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
      colProps: { span: 18 },
    },
    {
      label: '标签',
      field: 'labelIds',
      slot: 'label',
      component: 'Input',
      colProps: { span: 6 },
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
      colProps: { span: 3 },
    },
    {
      field: 'cateId',
      component: 'ApiCascader',
      rules: [{ required: true, message: '请选择文章分类' }],
      label: '分类',
      colProps: {
        span: 5,
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
          return !(record.type < 2);
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
      colProps: { span: 4 },
    },
    {
      field: 'postType',
      component: 'RadioGroup',
      label: '文章类型',
      defaultValue: '1',
      colProps: {
        span: 5,
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
        span: 7,
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
      // WriteDrawer,
      BasicTree,
    },
    setup() {
      const { createMessage } = useMessage();
      const route = useRoute();
      const go = useGo();
      const id = ref(route.params?.id);
      console.log(id);
      const editorType = ref(route.params?.editorType);
      // const [registerDrawer, { setFieldsValue }] = useDrawer();
      const value1 = ref<string>('a');
      const subjectList = ref<string[]>([]);
      const timedReleasetValue = ref<string>('0');
      const timedReleaseOptions = ref<Recordable[]>([]);
      const treeData = ref<TreeItem[]>([]);
      timedReleaseOptions.value = [
        { label: '停用', value: '0' },
        { label: '启用', value: '1' },
      ];

      function handleSuccess() {
        // reload();
      }
      async function handleSubmit(values: any) {
        // console.log(date,time)
        // let timedRelease = {date +' ' + time}
        // values.timedRelease = timedRelease
        console.log(values);
        let res = await createPost(values);
        console.log(res);
        createMessage.success('click search,values:' + JSON.stringify(values));
      }

      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/blog/post');
      }
      async function treeDateList() {
        let res = await getLabelTreeList();
        treeData.value = res;
      }
      async function getPostItemData() {
        let res = await getPostItem(id.value);
        console.log(res);
        schemas.value = res.items;
        // setFieldsValue(...res.items);
      }
      onMounted(() => {
        treeDateList();
        getPostItemData();
      });
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
        treeData,
        id,
      };
    },
  });
</script>
