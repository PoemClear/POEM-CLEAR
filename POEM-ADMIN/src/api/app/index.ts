import { defHttp } from '/@/utils/http/axios';
import { SuccessMessageMode } from '/#/axios';
interface GetBannerInfoModel {
  title: string;
  type: string;
  imageUrl: string[];
  like_url: string;
  sort: string;
  status: string;
  createTime: string;
}
interface BannerListItem {
  id: string;
  title: string;
  type: string;
  imageUrl: string[];
  like_url: string;
  sort: string;
  status: string;
  createTime: string;
}
enum Api {
  AppCateList = '/app/appCateList',
  AppCateLocation = '/app/appCateLocation',
  UpdateAppCate = '/app/updateAppCate',
  CreateAppCate = '/app/createAppCate',
  DelAppCate = '/delAppCate',

  BannerList = '/app/bannerList',
  CreateBanner = '/app/createBanner',
  UpdateBanner = '/app/updateBanner',
  DelBanner = '/app/delBanner',
  SetBannerStatus = '/app/setBannerStatus',

  LoadingList = '/app/loadingList',
  DelLoading = '/app/delLoading',
  CreateLoading = '/app/createLoading',
  UpdateLoading = '/app/updateLoading',
}

export function getAppCateList(params?: BannerListItem) {
  return defHttp.get({ url: Api.AppCateList, params });
}
export function getAppCateLocation(params?: BannerListItem) {
  return defHttp.get({ url: Api.AppCateLocation, params });
}
export function createAppCate(params?: object, mode: SuccessMessageMode = 'message') {
  return defHttp.post(
    { url: Api.CreateAppCate, params },
    {
      successMessageMode: mode,
    },
  );
}
export function updateAppCate(params?: BannerListItem, mode: SuccessMessageMode = 'message') {
  return defHttp.post<GetBannerInfoModel>(
    { url: Api.UpdateAppCate, params },
    {
      successMessageMode: mode,
    },
  );
}
export function delAppCate(id: number, mode: SuccessMessageMode = 'message') {
  return defHttp.post<GetBannerInfoModel>(
    { url: Api.DelAppCate, params: { id } },
    {
      successMessageMode: mode,
    },
  );
}

export function getBannerList(params?: BannerListItem) {
  return defHttp.get<GetBannerInfoModel>({ url: Api.BannerList, params });
}
export function createBanner(params?: BannerListItem, mode: SuccessMessageMode = 'message') {
  return defHttp.post<GetBannerInfoModel>(
    { url: Api.CreateBanner, params },
    {
      successMessageMode: mode,
    },
  );
}
export function updateBanner(params?: BannerListItem, mode: SuccessMessageMode = 'message') {
  return defHttp.post<GetBannerInfoModel>(
    { url: Api.UpdateBanner, params },
    {
      successMessageMode: mode,
    },
  );
}
export function delBanner(id: number, mode: SuccessMessageMode = 'message') {
  return defHttp.post<GetBannerInfoModel>(
    { url: Api.DelBanner, params: { id } },
    {
      successMessageMode: mode,
    },
  );
}

export const setBannerStatus = (id: number, status: string, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.SetBannerStatus, params: { id, status } },
    {
      successMessageMode: mode,
    },
  );

export function getLoadingList(params?: any) {
  return defHttp.get({ url: Api.LoadingList, params });
}
export function delLoading(id: number, mode: SuccessMessageMode = 'message') {
  return defHttp.post(
    { url: Api.DelLoading, params: { id } },
    {
      successMessageMode: mode,
    },
  );
}
export function createLoading(params?: any, mode: SuccessMessageMode = 'message') {
  return defHttp.post(
    { url: Api.CreateLoading, params },
    {
      successMessageMode: mode,
    },
  );
}
export function updateLoading(params?: any, mode: SuccessMessageMode = 'message') {
  return defHttp.post(
    { url: Api.UpdateLoading, params },
    {
      successMessageMode: mode,
    },
  );
}
