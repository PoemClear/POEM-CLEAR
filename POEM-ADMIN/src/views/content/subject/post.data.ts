import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { uploadApi } from '/@/api/sys/upload';
import { getPostSelectList } from '/@/api/content/blog';
export interface TabItem {
  key: string;
  name: string;
  component: string;
}

export const articleList = (() => {
  const result: any[] = [];
  for (let i = 0; i < 4; i++) {
    result.push({
      title: 'Vben Admin',
      description: ['Vben', '设计语言', 'Typescript'],
      content: '基于Vue Next, TypeScript, Ant Design实现的一套完整的企业级后台管理系统。',
      time: '2020-11-14 11:20',
    });
  }
  return result;
})();

export const achieveList: TabItem[] = [
  {
    key: '1',
    name: '文章',
    component: 'Article',
  },
  {
    key: '2',
    name: '应用',
    component: 'Application',
  },
  {
    key: '3',
    name: '项目',
    component: 'Project',
  },
];
export const projectList = (() => {
  const result: any[] = [];
  for (let i = 0; i < 8; i++) {
    result.push({
      title: 'Vben Admin',
      content: '基于Vue Next, TypeScript, Ant Design实现的一套完整的企业级后台管理系统。',
    });
  }
  return result;
})();

export const columns: BasicColumn[] = [
  {
    title: '专栏封面',
    dataIndex: 'cover',
    width: 80,
  },
  {
    title: '专栏标题',
    dataIndex: 'title',
    width: 180,
    align: 'left',
  },
  {
    title: '浏览 / 点赞 / 评论 / 收藏',
    dataIndex: 'view_count',
    width: 150,
  },
  { title: '更新 / 完结', dataIndex: 'num', width: 100 },
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
  // {
  //   title: '审核状态',
  //   dataIndex: 'checkStatus',
  //   width: 80,
  //   customRender: ({ record }) => {
  //     const status = record.checkStatus;
  //     const toDoEnable = ~~status === 0;
  //     const FailEnable = ~~status === 1;
  //     const SuccessEnable = ~~status === 2;
  //     const color = toDoEnable ? 'orange' : SuccessEnable ? 'green' : 'red';
  //     const text = toDoEnable ? '审核中' : FailEnable ? '未通过' : '审核通过';
  //     return h(Tag, { color: color }, () => text);
  //   },
  // },
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
    label: '专栏标题',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '停用', value: '0' },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'checkStatus',
    label: '审核状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '审核中', value: '0' },
        { label: '审核失败', value: '1' },
        { label: '审核通过', value: '2' },
      ],
    },
    colProps: { span: 6 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'cover',
    component: 'Upload',
    label: '上传封面',
    rules: [{ required: true, message: '请选择上传封面' }],
    componentProps: {
      api: uploadApi,
      maxSize: 20,
      maxNumber: 1,
    },
  },
  {
    field: 'title',
    label: '专栏标题',
    required: true,
    component: 'Input',
  },
  {
    label: '简介',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    field: 'postIds',
    component: 'Input',
    label: '选择文章',
    helpMessage: ['选择专栏文章', '将关键词发送到接口进行远程搜索'],
    // required: true,
    slot: 'remoteSearch',
    componentProps: {
      api: getPostSelectList,
    },
  },
  {
    field: 'isEnd',
    label: '完结',
    component: 'RadioGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '未完结', value: '0' },
        { label: '已完结', value: '1' },
      ],
    },
  },
  {
    field: 'openComment',
    label: '评论',
    component: 'RadioGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '打开', value: '1' },
        { label: '关闭', value: '0' },
      ],
    },
  },
  {
    field: 'isTop',
    label: '置顶',
    component: 'RadioGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '未置顶', value: '0' },
        { label: '置顶', value: '1' },
      ],
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
  },
  // {
  //   field: 'orderNo',
  //   label: '排序',
  //   defaultValue: '1',
  //   component: 'InputNumber',
  //   required: true,
  // },
];
