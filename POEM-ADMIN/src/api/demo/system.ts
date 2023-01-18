import {
  RoleListItem,
  AccountParams,
  DeptListItem,
  MenuParams,
  RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  DeptListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel,
} from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  AccountList = '/system/getAccountList',
  IsAccountExist = '/system/accountExist',
  DeptList = '/system/getDeptList',
  CreateDept = '/system/createDept',
  UpdateDept = '/system/updateDept',
  setRoleStatus = '/system/setRoleStatus',
  MenuList = '/system/getMenuList',
  CreateMenu = '/system/createMenu',
  UpdateMenu = '/system/updateMenu',
  RolePageList = '/system/getRoleListByPage',
  GetAllRoleList = '/system/getAllRoleList',
  UpdateRole = '/system/updateRole',
  CreateRole = '/system/createRole',
  DelRole = '/system/delRole',
  GetSelectDeptList = '/system/getSelectDeptList',
  CreateUser = '/system/createUser',
  UpdateUser = '/system/updateUser',
  DelUser = '/system/delUser',
  DelDept = '/system/delDept',
}

export const getAccountList = (params: AccountParams) =>
  defHttp.get<AccountListGetResultModel>({ url: Api.AccountList, params });

export const getDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.DeptList, params });

export const getSelectDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.GetSelectDeptList, params });

export const createDept = (params?: DeptListItem) =>
  defHttp.post<DeptListGetResultModel>({ url: Api.CreateDept, params });
export const updateDept = (params?: DeptListItem) =>
  defHttp.post<DeptListGetResultModel>({ url: Api.UpdateDept, params });

export const getMenuList = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });

export const createMenu = (params?: MenuParams) =>
  defHttp.post<MenuListGetResultModel>({ url: Api.CreateMenu, params });
export const delDept = (id: number) =>
  defHttp.post({ url: Api.DelDept, params:{id} });

export const updateMenu = (params?: MenuParams) =>
  defHttp.post<MenuListGetResultModel>({ url: Api.UpdateMenu, params });

export const getRoleListByPage = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.RolePageList, params });

export const getAllRoleList = (params?: RoleParams) =>
  defHttp.get<RoleListGetResultModel>({ url: Api.GetAllRoleList, params });

export const setRoleStatus = (id: number, status: string) =>
  defHttp.post({ url: Api.setRoleStatus, params: { id, status } });

export const UpdateRole = (params: RoleListItem) =>
  defHttp.post({ url: Api.UpdateRole, params }, { errorMessageMode: 'message' });

export const CreateRole = (params: RoleListItem) =>
  defHttp.post({ url: Api.CreateRole, params }, { errorMessageMode: 'message' });

export const isAccountExist = (account: string) =>
  defHttp.post({ url: Api.IsAccountExist, params: { account } }, { errorMessageMode: 'none' });

export const DelRole = (id: number) =>
  defHttp.post({ url: Api.DelRole, params: { id } }, { errorMessageMode: 'message' });

export const createUser = (params?: any) =>
  defHttp.post({ url: Api.CreateUser, params }, { errorMessageMode: 'message' });
export const updateUser = (params?: any) =>
  defHttp.post({ url: Api.UpdateUser, params }, { errorMessageMode: 'message' });
export const delUser = (id: number) =>
  defHttp.post({ url: Api.DelUser, params: { id } }, { errorMessageMode: 'message' });
