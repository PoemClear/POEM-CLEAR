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
  userId: string | number;
  views_count: number;
  createTime: string;
}

interface BannerListItem {
  userId: string | number;
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
  PostList = '/content/postList',
  PostSelectList = '/content/postSelectList',
  PostItem = '/content/postItem',
  PostCateList = '/content/cateList',
  CreatePost = '/content/createPost',
  UpdatePost = '/content/updatePost',
  // updatePost
  PostCateTreeList = '/content/cateTreeList',
  UpdateCate = '/content/updateCate',
  CreateCate = '/content/createCate',
  DelCate = '/content/delCate',
  DelPost = '/content/delPost',
  UpDatePostRecycle = '/content/upDatePostRecycle',
  UpdateCheckPost = '/content/updateCheckPost',
  LabelTreeList = '/content/labelTreeList',
  CreateLabel = '/content/createLabel',
  UpdateLabel = '/content/updateLabel',
}

export function getPostList(params?: any) {
  return defHttp.get({ url: Api.PostList, params });
}
export function getPostSelectList(params?: any) {
  return defHttp.get({ url: Api.PostSelectList, params });
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
export function updatePost(params?: object, mode: SuccessMessageMode = 'message') {
  return defHttp.post(
    { url: Api.UpdatePost, params },
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
