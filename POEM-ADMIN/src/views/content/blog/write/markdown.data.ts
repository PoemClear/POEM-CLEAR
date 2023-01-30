import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { MarkDown } from '/@/components/Markdown';
import { getPostCateList } from '/@/api/content/blog';
import { uploadApi } from '/@/api/sys/upload';
export const formSchema: FormSchema[] = [
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
    rules: [{ required: true, message: '请选择文章分类' }],
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
    label: '标签',
    field: 'labelIds',
    slot: 'label',
    component: 'Input',
    colProps: { span: 8 },
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
