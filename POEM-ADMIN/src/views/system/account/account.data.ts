import { getAllRoleList } from '/@/api/demo/system';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { uploadApi } from '/@/api/sys/upload';
export const columns: BasicColumn[] = [
  {
    title: '姓名',
    dataIndex: 'realName',
    width: 120,
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '角色',
    dataIndex: 'roleValue',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status;
      const toDoEnable = ~~status === 0;
      const color = toDoEnable ? 'red' : 'green';
      const text = toDoEnable ? '未激活' : '已激活';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'avatar',
    component: 'Upload',
    label: '头像',
    rules: [{ required: true, message: '请选择上传头像' }],
    componentProps: {
      api: uploadApi,
      maxSize: 20,
      maxNumber: 1,
    },
  },
  {
    field: 'username',
    label: '账号',
    component: 'Input',
    helpMessage: ['登录账号'],
    rules: [
      {
        required: true,
        message: '请输入用户名',
      },
    ],
  },
  {
    field: 'realName',
    label: '真实姓名',
    component: 'Input',
    required: true,
  },
  {
    field: 'phone',
    label: '手机号',
    helpMessage: ['手机号码也可以作为登录密码'],
    component: 'InputNumber',
    required: true,
    ifShow: true,
  },
  {
    field: 'pwd',
    label: '密码',
    helpMessage: ['登录密码', '前往个人设置修改密码'],
    component: 'InputPassword',
    required: true,
    ifShow: true,
  },
  {
    label: '角色',
    field: 'roleValue',
    component: 'ApiSelect',
    componentProps: {
      api: getAllRoleList,
      labelField: 'roleName',
      valueField: 'roleValue',
    },
    required: true,
  },
  {
    field: 'deptId',
    label: '所属部门',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'deptName',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
    required: false,
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    required: false,
  },
  {
    field: 'status',
    label: '激活账号',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '未激活', value: '0' },
        { label: '激活', value: '1' },
      ],
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
