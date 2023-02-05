import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { uploadApi } from '/@/api/sys/upload';
import { getDictValue } from '/@/api/system';
import { Tag } from 'ant-design-vue';
export const columns: BasicColumn[] = [
  {
    title: '轮播图',
    dataIndex: 'image_url',
    width: 100,
  },
  {
    title: '跳转链接',
    dataIndex: 'link_url',
    width: 600,
  },

  {
    title: '排序',
    dataIndex: 'orderNo',
    width: 50,
  },
  {
    title: '位置',
    dataIndex: 'typeName',
    customRender: ({ record }) => {
      const color = 'pink';
      return h(Tag, { color: color }, () => record.typeName);
    },
    width: 80,
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
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 180,
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '轮播图位置',
    field: 'type',
    component: 'ApiSelect',
    componentProps: {
      api: getDictValue,
      params: {
        value: 'bannerPosition',
      },
      labelField: 'label',
      valueField: 'value',
    },
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
    field: 'image_url',
    component: 'Upload',
    label: '上传图片',
    rules: [{ required: true, message: '请选择上传图片' }],
    componentProps: {
      api: uploadApi,
      maxSize: 20,
      maxNumber: 1,
    },
  },
  {
    label: '轮播图位置',
    field: 'type',
    component: 'ApiSelect',
    componentProps: {
      api: getDictValue,
      params: {
        value: 'bannerPosition',
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
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '停用', value: '0' },
      ],
    },
  },
  {
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    defaultValue: '1',
    required: true,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
