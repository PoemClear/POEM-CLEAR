import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
export const columns: BasicColumn[] = [
  {
    title: '文件',
    dataIndex: 'originalname',
  },

  {
    title: '类型',
    dataIndex: 'type',
    width: 120,
    customRender: ({ record }) => {
      const color = 'blue';
      const text = record.type;
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '作者',
    dataIndex: 'author',
    customRender: ({ record }) => {
      return h(Tag, { color: 'cyan' }, () => record.author.username);
    },
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
  },
];

export const searchFormSchema: FormSchema[] = [
  // {
  //   field: 'title',
  //   label: '文件标题',
  //   component: 'Input',
  //   colProps: { span: 6 },
  // },
  {
    field: 'postType',
    label: '文件类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '图片', value: 'image' },
        { label: '视频', value: 'video' },
        { label: '其他', value: 'other' },
      ],
    },
    colProps: { span: 6 },
  },
];
