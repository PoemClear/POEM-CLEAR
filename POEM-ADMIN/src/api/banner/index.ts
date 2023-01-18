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
  BannerList = '/bannerList',
  CreateBanner = '/createBanner',
  UpdateBanner = '/updateBanner',
  DelBanner = '/delBanner',
  SetBannerStatus = '/setBannerStatus',
}

export function getBannerList(params?: BannerListItem) {
  return defHttp.get<GetBannerInfoModel>({ url: Api.BannerList, params });
}
export function createBanner(params?: BannerListItem) {
  return defHttp.post<GetBannerInfoModel>({ url: Api.CreateBanner, params });
}
export function updateBanner(params?: BannerListItem) {
  return defHttp.post<GetBannerInfoModel>({ url: Api.UpdateBanner, params });
}
export function delBanner(id: number) {
  return defHttp.post<GetBannerInfoModel>({ url: Api.DelBanner, params: { id } });
}

export const setBannerStatus = (id: number, status: string) =>
  defHttp.post({ url: Api.SetBannerStatus, params: { id, status } });
