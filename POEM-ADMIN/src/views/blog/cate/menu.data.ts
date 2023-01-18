import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const columns: BasicColumn[] = [
  {
    title: '分类名称',
    dataIndex: 'title',
    width: 300,
    align: 'left',
  },
  {
    title: '封面',
    dataIndex: 'image_url',
    width: 150,
  },
  {
    title: '主图',
    dataIndex: 'cover',
    width: 80,
  },
  {
    title: '浏览量',
    dataIndex: 'views_count',
    width: 80,
  },
  {
    title: '点赞量',
    dataIndex: 'like_count',
    width: 80,
  },
  {
    title: '评论量',
    dataIndex: 'comment_count',
    width: 80,
  },
  {
    title: '排序',
    dataIndex: 'orderNo',
    width: 50,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 0;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '分类名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'title',
    label: '分类名称',
    component: 'Input',
    required: true,
  },

  {
    field: 'parentId',
    label: '上级分类',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'title',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },

  {
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    required: true,
  },

  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '禁用', value: '1' },
      ],
    },
  },
];
