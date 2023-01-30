import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch, Tag } from 'ant-design-vue';
import { setRoleStatus } from '/@/api/demo/system';
import { useMessage } from '/@/hooks/web/useMessage';
import { uploadApi } from '/@/api/sys/upload';
import { getPostList } from '/@/api/content/blog';
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
    title: '专题封面',
    dataIndex: 'cover',
    width: 80,
  },
  {
    title: '专题标题',
    dataIndex: 'title',
    width: 300,
    align: 'left',
  },

  { title: '更新 / 完结', dataIndex: 'num', width: 100 },
  {
    title: '排序',
    dataIndex: 'orderNo',
    width: 50,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.status === '1',
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? '1' : '0';
          const { createMessage } = useMessage();
          setRoleStatus(record.id, newStatus)
            .then(() => {
              record.status = newStatus;
              createMessage.success(`已成功修改专题状态`);
            })
            .catch(() => {
              // createMessage.error('修改专题状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
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
    label: '专题标题',
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
    label: '专题标题',
    required: true,
    component: 'Input',
  },
  {
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    required: true,
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
    helpMessage: ['ApiSelect组件', '将关键词发送到接口进行远程搜索'],
    required: true,
    slot: 'remoteSearch',
    componentProps: {
      api: getPostList,
    },
  },
  {
    field: 'isEnd',
    label: '是否完结',
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
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '停用', value: '0' },
        { label: '启用', value: '1' },
      ],
    },
  },
];
