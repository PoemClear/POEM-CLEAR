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
import { SuccessMessageMode } from '/#/axios';
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
  DelMenu = '/system/delMenu',
  DictTreeList = '/system/dictTreeList',
  UpdateDict = '/system/updateDict',
  CreateDict = '/system/createDict',
  DictList = '/system/dictList',
  DictValue = '/system/dictValue',
  UpdateUserInfo = '/system/updateUserInfo',
  FileList = '/file/fileList',
}

export const getAccountList = (params: AccountParams) =>
  defHttp.get<AccountListGetResultModel>({ url: Api.AccountList, params });

export const getDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.DeptList, params });
export const getDictValue = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.DictValue, params });

export const getSelectDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.GetSelectDeptList, params });

export const createDept = (params?: DeptListItem, mode: SuccessMessageMode = 'message') =>
  defHttp.post<DeptListGetResultModel>(
    { url: Api.CreateDept, params },
    {
      successMessageMode: mode,
    },
  );
export const updateDept = (params?: DeptListItem, mode: SuccessMessageMode = 'message') =>
  defHttp.post<DeptListGetResultModel>(
    { url: Api.UpdateDept, params },
    {
      successMessageMode: mode,
    },
  );

export const getMenuList = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });
export const getDictTreeList = (params?: MenuParams) =>
  defHttp.get({ url: Api.DictTreeList, params });
export const createMenu = (params?: MenuParams, mode: SuccessMessageMode = 'message') =>
  defHttp.post<MenuListGetResultModel>(
    { url: Api.CreateMenu, params },
    {
      successMessageMode: mode,
    },
  );
export const delDept = (id: number, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.DelDept, params: { id } },
    {
      successMessageMode: mode,
    },
  );

export const updateMenu = (params?: MenuParams, mode: SuccessMessageMode = 'message') =>
  defHttp.post<MenuListGetResultModel>(
    { url: Api.UpdateMenu, params },
    {
      successMessageMode: mode,
    },
  );

export const getRoleListByPage = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.RolePageList, params });

export const getAllRoleList = (params?: RoleParams) =>
  defHttp.get<RoleListGetResultModel>({ url: Api.GetAllRoleList, params });

export const setRoleStatus = (id: number, status: string, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.setRoleStatus, params: { id, status } },
    {
      successMessageMode: mode,
    },
  );

export const UpdateRole = (params: RoleListItem, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.UpdateRole, params },
    {
      successMessageMode: mode,
    },
  );

export const CreateRole = (params: RoleListItem, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.CreateRole, params },
    {
      successMessageMode: mode,
    },
  );

export const isAccountExist = (account: string) =>
  defHttp.post({ url: Api.IsAccountExist, params: { account } }, { errorMessageMode: 'none' });

export const DelRole = (id: number, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.DelRole, params: { id } },
    {
      successMessageMode: mode,
    },
  );

export const createUser = (params?: any, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.CreateUser, params },
    {
      successMessageMode: mode,
    },
  );
export const updateUser = (params?: any, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.UpdateUser, params },
    {
      successMessageMode: mode,
    },
  );
export const delUser = (id: number, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.DelUser, params: { id } },
    {
      successMessageMode: mode,
    },
  );
export const delMenu = (id: number, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.DelMenu, params: { id } },
    {
      successMessageMode: mode,
    },
  );

export const createDict = (params?: any, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.CreateDict, params },
    {
      successMessageMode: mode,
    },
  );
export const updateDict = (params?: any, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.UpdateDict, params },
    {
      successMessageMode: mode,
    },
  );
export const updateUserInfo = (params?: any, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.UpdateUserInfo, params },
    {
      successMessageMode: mode,
    },
  );
export const getDictList = (params?: any) => defHttp.post({ url: Api.DictList, params });
export const getFileList = (params?: any) => defHttp.get({ url: Api.FileList, params });
