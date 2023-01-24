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
  NoticeList = '/noticeList',
  CreateNotice = '/createNotice',
  UpdateNotice = '/updateNotice',
  DelBanner = '/delBanner',
  SetBannerStatus = '/setBannerStatus',
}

export function getNoticeList(params?: BannerListItem) {
  return defHttp.get<GetBannerInfoModel>({ url: Api.NoticeList, params });
}
export function createNotice(params?: BannerListItem) {
  return defHttp.post<GetBannerInfoModel>({ url: Api.CreateNotice, params });
}
export function updateNotice(params?: BannerListItem) {
  return defHttp.post<GetBannerInfoModel>({ url: Api.UpdateNotice, params });
}
export function delBanner(id: number) {
  return defHttp.post<GetBannerInfoModel>({ url: Api.DelBanner, params: { id } });
}

export const setBannerStatus = (id: number, status: string) =>
  defHttp.post({ url: Api.SetBannerStatus, params: { id, status } });
