import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { getDictValue } from '/@/api/system';
import { Tag } from 'ant-design-vue';
export const columns: BasicColumn[] = [
  {
    title: '公告标题',
    dataIndex: 'title',
    width: 300,
  },
  {
    title: '类型',
    dataIndex: 'typeName',
    customRender: ({ record }) => {
      const color = 'green';
      return h(Tag, { color: color }, () => record.typeName);
    },
    width: 100,
  },
  {
    title: '公告状态',
    dataIndex: 'noticeStatusName',
    customRender: ({ record }) => {
      const color = 'cyan';
      return h(Tag, { color: color }, () => record.noticeStatusName);
    },
    width: 100,
  },

  {
    title: '跳转链接',
    dataIndex: 'link_url',
    width: 500,
  },

  {
    title: '排序',
    dataIndex: 'orderNo',
    width: 50,
  },
  {
    title: 'SWITCHTAB',
    dataIndex: 'switchTab',
    customRender: ({ record }) => {
      const status = record.switchTab;
      const enable = ~~status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? 'switchTab' : 'no';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status;
      const toDoEnable = ~~status === 1;
      const color = toDoEnable ? 'green' : 'red';
      const text = toDoEnable ? '已启用' : '已关闭';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
  // {
  //   title: '更新时间',
  //   dataIndex: 'updateTime',
  //   width: 180,
  // },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '标题',
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
];

export const formSchema: FormSchema[] = [
  {
    field: 'title',
    label: '公告标题',
    required: true,
    component: 'Input',
  },
  {
    label: '公告类型',
    field: 'type',
    component: 'ApiSelect',
    componentProps: {
      api: getDictValue,
      params: {
        value: 'noticeType',
      },
      labelField: 'label',
      valueField: 'value',
    },
    required: true,
  },
  {
    label: '公告状态',
    field: 'noticeStatus',
    component: 'ApiSelect',
    componentProps: {
      api: getDictValue,
      params: {
        value: 'noticeStatus',
      },
      labelField: 'label',
      valueField: 'value',
    },
    required: true,
  },
  {
    field: 'link_url',
    label: '跳转链接',
    required: true,
    component: 'InputTextArea',
  },
  {
    field: 'orderNo',
    label: '排序',
    defaultValue: '1',
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'switchTab',
    label: 'switchTab',
    component: 'RadioGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
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
];
