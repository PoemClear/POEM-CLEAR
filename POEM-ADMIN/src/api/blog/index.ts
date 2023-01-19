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
  PostCateTreeList = '/post/cateTreeList',
  UpdateCate = '/post/updateCate',
  CreateCate = '/post/createCate',
  DelCate = '/post/delCate',
  DelPost = '/delPost',
  UpDatePostRecycle = '/upDatePostRecycle',
  UpdateCheckPost = '/updateCheckPost',
}

export function getPostList(params?: any) {
  return defHttp.get({ url: Api.PostList, params });
}

export function createCate(params?: BannerListItem) {
  return defHttp.post<GetPostInfoModel>({ url: Api.CreateCate, params });
}
export function getPostItem(id: number) {
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

export function getPosTreeTCateList(params?: BannerListItem) {
  return defHttp.get<GetPostInfoModel>({ url: Api.PostCateTreeList, params });
}

export function getPostCateList(data?: CateParams) {
  return defHttp.post<CateModel>({ url: Api.PostCateList, data });
}
