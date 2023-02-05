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
  NoticeList = '/noticeList',
  CreateNotice = '/createNotice',
  NoticeRead = '/NoticeRead',
  UpdateNotice = '/updateNotice',
  NoticeMessageList = '/NoticeMessageList',
  DelNotice = '/delNotice',
  SetBannerStatus = '/setBannerStatus',
}

export function getNoticeList(params?: BannerListItem) {
  return defHttp.get<GetBannerInfoModel>({ url: Api.NoticeList, params });
}
export function getNoticeMessageList(params?: any) {
  return defHttp.get({ url: Api.NoticeMessageList, params });
}
export function noticeRead(params?: any, mode: SuccessMessageMode = 'message') {
  return defHttp.get(
    { url: Api.NoticeRead, params },
    {
      successMessageMode: mode,
    },
  );
}
export function createNotice(params?: BannerListItem, mode: SuccessMessageMode = 'message') {
  return defHttp.post<GetBannerInfoModel>(
    { url: Api.CreateNotice, params },
    {
      successMessageMode: mode,
    },
  );
}
export function updateNotice(params?: BannerListItem, mode: SuccessMessageMode = 'message') {
  return defHttp.post<GetBannerInfoModel>(
    { url: Api.UpdateNotice, params },
    {
      successMessageMode: mode,
    },
  );
}
export function delNotice(id: number, mode: SuccessMessageMode = 'message') {
  return defHttp.post<GetBannerInfoModel>(
    { url: Api.DelNotice, params: { id } },
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
