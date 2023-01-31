import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { getPostCateList } from '/@/api/content/blog';
import { uploadApi } from '/@/api/sys/upload';
import { MarkDown } from '/@/components/Markdown';
import { Tinymce } from '/@/components/Tinymce/index';
export const columns: BasicColumn[] = [
  {
    title: '封面',
    dataIndex: 'cover',
    width: 80,
  },
  {
    title: '文章标题',
    dataIndex: 'title',
    width: 150,
  },
  {
    title: '浏览 / 点赞 / 评论 / 收藏',
    dataIndex: 'view_count',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status;
      const toDoEnable = ~~status === 1;
      const color = toDoEnable ? 'green' : 'yellow';
      const text = toDoEnable ? '显示' : '隐藏';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '评论',
    dataIndex: 'openComment',
    width: 80,
    customRender: ({ record }) => {
      const status = record.openComment;
      const toDoEnable = ~~status === 1;
      const color = toDoEnable ? 'blue' : 'pink';
      const text = toDoEnable ? '已开启' : '已关闭';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '置顶',
    dataIndex: 'isTop',
    width: 80,
    customRender: ({ record }) => {
      const status = record.isTop;
      const toDoEnable = ~~status === 1;
      const color = toDoEnable ? 'blue' : '';
      const text = toDoEnable ? '已置顶' : '未置顶';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '审核状态',
    dataIndex: 'checkStatus',
    width: 80,
    customRender: ({ record }) => {
      const status = record.checkStatus;
      const toDoEnable = ~~status === 0;
      const FailEnable = ~~status === 1;
      const SuccessEnable = ~~status === 2;
      const color = toDoEnable ? 'orange' : SuccessEnable ? 'green' : 'red';
      const text = toDoEnable ? '审核中' : FailEnable ? '未通过' : '审核通过';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '作者',
    dataIndex: 'author',
    width: 100,
    customRender: ({ record }) => {
      return h(Tag, { color: 'cyan' }, () => record.author.username);
    },
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '文章标题',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'postType',
    label: '文章类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '原创', value: '1' },
        { label: '转载', value: '2' },
        { label: '翻译', value: '3' },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '显示', value: '1' },
        { label: '隐藏', value: '0' },
      ],
    },
    colProps: { span: 6 },
  },
];

const isMarkdown = (type: string) => type === '1';
const isTinymce = (type: string) => type === '2';
export const formSchema: FormSchema[] = [
  {
    field: 'type',
    label: '编辑器类型',
    component: 'RadioButtonGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: 'Markdown编辑器', value: '1' },
        { label: 'Tinymce富文本', value: '2' },
      ],
    },
  },
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
    defaultValue: '请输入文章内容',
    rules: [{ required: true, trigger: 'blur' }],
    render: ({ model, field }) => {
      return h(MarkDown, {
        value: model[field],
        onChange: (value: string) => {
          model[field] = value;
        },
      });
    },
    ifShow: ({ values }) => !isTinymce(values.type),
  },

  {
    field: 'content',
    component: 'Input',
    label: '内容',
    defaultValue: '请输入文章内容',
    rules: [{ required: true }],
    render: ({ model, field }) => {
      return h(Tinymce, {
        value: model[field],
        onChange: (value: string) => {
          model[field] = value;
        },
      });
    },
    ifShow: ({ values }) => !isMarkdown(values.type),
  },

  {
    field: 'cover',
    component: 'Upload',
    label: '上传封面',
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
        { label: '显示', value: '1' },
        { label: '隐藏', value: '0' },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'openComment',
    label: '开启评论',
    component: 'RadioButtonGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '打开', value: '1' },
        { label: '关闭', value: '0' },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'isTop',
    label: '置顶文章',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '置顶', value: '1' },
        { label: '未置顶', value: '0' },
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
