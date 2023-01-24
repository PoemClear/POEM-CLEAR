import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { setBannerStatus } from '/@/api/banner';
import { useMessage } from '/@/hooks/web/useMessage';
import { uploadApi } from '/@/api/sys/upload';
import { getDictList } from '/@/api/demo/system';
import { Tag } from 'ant-design-vue';
export const columns: BasicColumn[] = [
  {
    title: '轮播图',
    dataIndex: 'image_url',
    width: 100,
  },
  {
    title: '位置',
    dataIndex: 'typeName',
    customRender: ({ record }) => {
      const color = 'green';
      return h(Tag, { color: color }, () => record.typeName);
    },
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
              createMessage.success(`已成功修改轮播图状态`);
            })
            .catch(() => {
              // createMessage.error('修改轮播图状态失败');
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
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'remark',
    label: '备注',
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
    field: 'type',
    component: 'ApiCascader',
    helpMessage: ['标注位置'],
    label: '轮播图位置',
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
  {
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    required: true,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
