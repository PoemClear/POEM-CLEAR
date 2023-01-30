import { defHttp } from '/@/utils/http/axios';
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
  
  DelBanner = '/delBanner',
  SetBannerStatus = '/setBannerStatus',
}

export function getAppCateList(params?: BannerListItem) {
  return defHttp.get({ url: Api.AppCateList, params });
}
export function createBanner(params?: BannerListItem) {
  return defHttp.post<GetBannerInfoModel>({ url: Api.CreateBanner, params });
}
export function createAppCate(params?: object) {
  return defHttp.post({ url: Api.CreateAppCate, params });
}
export function updateAppCate(params?: BannerListItem) {
  return defHttp.post<GetBannerInfoModel>({ url: Api.UpdateAppCate, params });
}
export function delBanner(id: number) {
  return defHttp.post<GetBannerInfoModel>({ url: Api.DelBanner, params: { id } });
}

export const setBannerStatus = (id: number, status: string) =>
  defHttp.post({ url: Api.SetBannerStatus, params: { id, status } });
