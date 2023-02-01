import { defHttp } from '/@/utils/http/axios';
import { SuccessMessageMode } from '/#/axios';
interface GetPostInfoModel {
  id?: string | number;
  collect_count: number;
  comment_count: number;
  content: string;
  cover: string;
  description: string;
  cate_id?: string;
  integral: number;
  label_id: string[];
  label_title: string;
  like_count: string;
  openid: string;
  orderNo: string;
  status?: string;
  title: string;
  userId: string[];
  views_count: number;
  createTime: string;
}

interface BannerListItem {
  id?: string | number;
  collect_count: number;
  comment_count: number;
  content: string;
  cover: string;
  description: string;
  cate_id?: string;
  integral: number;
  label_id: string[];
  label_title: string;
  like_count: string;
  openid: string;
  orderNo: string;
  status?: string;
  title: string;
  userId: string[];
  views_count: number;
  createTime: string;
}

export interface CateModel {
  id: string | number;
  title: string;
  parentId: number;
  type: number;
}

export interface CateParams {
  parentId: number;
}

enum Api {
  PostList = '/postList',
  PostItem = '/postItem',
  PostCateList = '/post/cateList',
  CreatePost = '/createPost',
  PostCateTreeList = '/post/cateTreeList',
  UpdateCate = '/post/updateCate',
  CreateCate = '/post/createCate',
  DelCate = '/post/delCate',
  DelPost = '/delPost',
  UpDatePostRecycle = '/upDatePostRecycle',
  UpdateCheckPost = '/updateCheckPost',
  LabelTreeList = '/post/labelTreeList',
  CreateLabel = '/post/createLabel',
  UpdateLabel = '/post/updateLabel',
}

export function getPostList(params?: any) {
  return defHttp.get({ url: Api.PostList, params });
}
export function getLabelTreeList(params?: any) {
  return defHttp.get({ url: Api.LabelTreeList, params });
}
export function createCate(params?: BannerListItem, mode: SuccessMessageMode = 'message') {
  return defHttp.post<GetPostInfoModel>(
    { url: Api.CreateCate, params },
    {
      successMessageMode: mode,
    },
  );
}
export function createPost(params?: BannerListItem, mode: SuccessMessageMode = 'message') {
  return defHttp.post<GetPostInfoModel>(
    { url: Api.CreatePost, params },
    {
      successMessageMode: mode,
    },
  );
}
export function createLabel(params?: BannerListItem, mode: SuccessMessageMode = 'message') {
  return defHttp.post<GetPostInfoModel>(
    { url: Api.CreateLabel, params },
    {
      successMessageMode: mode,
    },
  );
}
export function getPostItem(id: string | number) {
  return defHttp.get({ url: Api.PostItem, params: { id } });
}
export function updateCheckPost(
  id: number,
  checkStatus: string,
  mode: SuccessMessageMode = 'message',
) {
  return defHttp.post(
    { url: Api.UpdateCheckPost, params: { id, checkStatus } },
    {
      successMessageMode: mode,
    },
  );
}

export function upDatePostRecycle(
  id: number,
  isRecycle: string,
  mode: SuccessMessageMode = 'message',
) {
  return defHttp.post(
    { url: Api.UpDatePostRecycle, params: { id, isRecycle } },
    {
      successMessageMode: mode,
    },
  );
}

export function delPost(id: number, mode: SuccessMessageMode = 'message') {
  return defHttp.post(
    { url: Api.DelPost, params: { id } },
    {
      successMessageMode: mode,
    },
  );
}

export function delCate(id: number, mode: SuccessMessageMode = 'message') {
  return defHttp.post(
    { url: Api.DelCate, params: { id } },
    {
      successMessageMode: mode,
    },
  );
}

export const updateCate = (data: any, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.UpdateCate, data },
    {
      successMessageMode: mode,
    },
  );
export const updateLabel = (data: any, mode: SuccessMessageMode = 'message') =>
  defHttp.post(
    { url: Api.UpdateLabel, data },
    {
      successMessageMode: mode,
    },
  );
export function getPosTreeTCateList(params?: BannerListItem) {
  return defHttp.get<GetPostInfoModel>({ url: Api.PostCateTreeList, params });
}

export function getPostCateList(data?: CateParams) {
  return defHttp.post<CateModel>({ url: Api.PostCateList, data });
}
