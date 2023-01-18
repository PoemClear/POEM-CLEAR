import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {setBannerStatus} from '/@/api/banner';
import {useMessage} from '/@/hooks/web/useMessage';
import {uploadApi} from '/@/api/sys/upload';
import {Tinymce} from '/@/components/Tinymce/index';

export const columns: BasicColumn[] = [
  // {
  //   title: '轮播图名称',
  //   dataIndex: 'title',
  //   width: 200,
  // },
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
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({record}) => {
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
          const {createMessage} = useMessage();
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
    colProps: {span: 6},
  },
  {
    field: 'type',
    label: '分类',
    component: 'Select',
    componentProps: {
      options: [
        {label: '首页顶部', value: '1'},
        {label: '快捷入口', value: '2'},
        {label: '工具', value: '3'},
        {label: '壁纸', value: '5'},
        {label: '博客', value: '6'},
        {label: '我的', value: '7'},
        {label: '日历轮播', value: '8'},
      ],
    },
    colProps: {span: 6},
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        {label: '启用', value: '1'},
        {label: '停用', value: '0'},
      ],
    },
    colProps: {span: 6},
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    label: '标题',
    defaultValue: 'defaultValue',
    rules: [{required: true}],
  },
  {
    field: 'tinymce',
    component: 'Input',
    label: '内容',
    defaultValue: 'defaultValue',
    rules: [{required: true}],
    render: ({model, field}) => {
      return h(Tinymce, {
        value: model[field],
        onChange: (value: string) => {
          model[field] = value;
        },
      });
    },
  },
  {
    field: 'image_url',
    component: 'Upload',
    label: '上传图片',
    rules: [{required: true, message: '请选择上传图片'}],
    componentProps: {
      api: uploadApi,
      maxSize: 20,
      maxNumber: 1,
    },
  },
  // {
  //   field: 'type',
  //   label: '分类',
  //   component: 'Select',
  //   required: true,
  //   componentProps: {
  //     options: [
  //       {label: '首页顶部', value: '1'},
  //       {label: '快捷入口', value: '2'},
  //       {label: '工具', value: '3'},
  //       {label: '壁纸', value: '5'},
  //       {label: '博客', value: '6'},
  //       {label: '我的', value: '7'},
  //       {label: '日历轮播', value: '8'},
  //     ],
  //   },
  // },
  // {
  //   field: 'link_url',
  //   label: '跳转链接',
  //   required: true,
  //   component: 'InputTextArea',
  // },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        {label: '启用', value: '1'},
        {label: '停用', value: '0'},

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
