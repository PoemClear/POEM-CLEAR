import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { setBannerStatus } from '/@/api/banner';
import { useMessage } from '/@/hooks/web/useMessage';
import { getDictList } from '/@/api/demo/system';
import { Tag } from 'ant-design-vue';
export const columns: BasicColumn[] = [
  {
    title: '公告标题',
    dataIndex: 'title',
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
    dataIndex: 'noticeStatus',
    // customRender: ({ record }) => {
    //   const color = 'green';
    //   return h(Tag, { color: color }, () => record.noticeStatusName);
    // },
    customRender: ({ record }) => {
      const status = record.noticeStatus[1];
      const toDoEnable = ~~status === 18;
      const FailEnable = ~~status === 19;
      const SuccessEnable = ~~status === 20;
      const color = toDoEnable ? 'orange' : SuccessEnable ? 'green' : 'red';
      const text = toDoEnable ? '一般' : FailEnable ? '重要' : '紧急';
      return h(Tag, { color: color }, () => text);
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
          setBannerStatus(record.id, newStatus)
            .then(() => {
              record.status = newStatus;
              createMessage.success(`已成功修改公告状态`);
            })
            .catch(() => {
              // createMessage.error('修改公告状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
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
    field: 'type',
    component: 'ApiCascader',
    helpMessage: ['标注类型'],
    label: '公告类型',
    required: true,
    componentProps: {
      api: getDictList,
      apiParamKey: 'parentId',
      dataField: 'data',
      labelField: 'label',
      valueField: 'id',
      initFetchParams: {
        parentId: '',
        value: 'banner',
      },
      isLeaf: (record) => {
        return !(record.type < 2);
      },
    },
  },
  {
    field: 'noticeStatus',
    component: 'ApiCascader',
    helpMessage: ['标注状态'],
    label: '公告状态',
    required: true,
    componentProps: {
      api: getDictList,
      apiParamKey: 'parentId',
      dataField: 'data',
      labelField: 'label',
      valueField: 'id',
      initFetchParams: {
        parentId: '',
        value: 'banner',
      },
      isLeaf: (record) => {
        return !(record.type < 2);
      },
    },
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
        { label: '否', value: '0' },
        { label: '是', value: '1' },
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
