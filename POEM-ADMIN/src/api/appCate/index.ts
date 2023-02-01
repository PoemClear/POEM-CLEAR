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
  AppCateList = '/appCateList',
  CreateBanner = '/createBanner',
  UpdateAppCate = '/updateAppCate',
  CreateAppCate = '/createAppCate',

  DelAppCate = '/delAppCate',
  SetBannerStatus = '/setBannerStatus',
}

export function getAppCateList(params?: BannerListItem) {
  return defHttp.get({ url: Api.AppCateList, params });
}
export function createBanner(params?: BannerListItem, mode: SuccessMessageMode = 'message') {
  return defHttp.post<GetBannerInfoModel>(
    { url: Api.CreateBanner, params },
    {
      successMessageMode: mode,
    },
  );
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

export const setBannerStatus = (id: number, status: string, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.SetBannerStatus, params: { id, status } },
    {
      successMessageMode: mode,
    },
  );
