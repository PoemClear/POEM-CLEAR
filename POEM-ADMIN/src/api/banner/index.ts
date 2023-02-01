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
  BannerList = '/bannerList',
  CreateBanner = '/createBanner',
  UpdateBanner = '/updateBanner',
  DelBanner = '/delBanner',
  SetBannerStatus = '/setBannerStatus',
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
