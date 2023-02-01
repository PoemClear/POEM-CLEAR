import { defHttp } from '/@/utils/http/axios';

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
export function createCate(params?: BannerListItem) {
  return defHttp.post<GetPostInfoModel>({ url: Api.CreateCate, params });
}
export function createPost(params?: BannerListItem) {
  return defHttp.post<GetPostInfoModel>(
    { url: Api.CreatePost, params },
    { errorMessageMode: 'message' },
  );
}
export function updatePost(params?: object) {
  return defHttp.post({ url: Api.UpdatePost, params }, { errorMessageMode: 'message' });
}
export function createLabel(params?: BannerListItem) {
  return defHttp.post<GetPostInfoModel>({ url: Api.CreateLabel, params });
}
export function getPostItem(id: string | number) {
  return defHttp.get({ url: Api.PostItem, params: { id } });
}
export function updateCheckPost(id: number, checkStatus: string) {
  return defHttp.post({ url: Api.UpdateCheckPost, params: { id, checkStatus } });
}

export function upDatePostRecycle(id: number, isRecycle: string) {
  return defHttp.post({ url: Api.UpDatePostRecycle, params: { id, isRecycle } });
}

export function delPost(id: number) {
  return defHttp.post({ url: Api.DelPost, params: { id } });
}

export function delCate(id: number) {
  return defHttp.post({ url: Api.DelCate, params: { id } }, { errorMessageMode: 'message' });
}

export const updateCate = (data: any) => defHttp.post({ url: Api.UpdateCate, data });
export const updateLabel = (data: any) => defHttp.post({ url: Api.UpdateLabel, data });
export function getPosTreeTCateList(params?: BannerListItem) {
  return defHttp.get<GetPostInfoModel>({ url: Api.PostCateTreeList, params });
}

export function getPostCateList(data?: CateParams) {
  return defHttp.post<CateModel>({ url: Api.PostCateList, data });
}
