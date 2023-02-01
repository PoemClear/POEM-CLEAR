import { defHttp } from '/@/utils/http/axios';
import { SuccessMessageMode } from '/#/axios';
enum Api {
  SubjectList = '/content/subjectList',
  CreateSubject = '/content/createSubject',
  UpdateSubject = '/content/updateSubject',
  SubjectItem = '/content/subjectItem',
  updateCheckSubject = '/content/updateCheckSubject',
  upDateSubjectRecycle = '/content/upDateSubjectRecycle',
  // delSubjectPost
  DelSubjectPost = '/content/delSubjectPost',
}

export function getSubjectList(params?: any) {
  return defHttp.get({ url: Api.SubjectList, params });
}
export function createSubject(data?: any) {
  return defHttp.post({ url: Api.CreateSubject, data });
}
export function updateSubject(params?: object, mode: SuccessMessageMode = 'message') {
  return defHttp.post(
    { url: Api.UpdateSubject, params },
    {
      successMessageMode: mode,
    },
  );
}
export function delSubjectPost(id: number, mode: SuccessMessageMode = 'message') {
  return defHttp.post(
    { url: Api.DelSubjectPost, params: { id } },
    {
      successMessageMode: mode,
    },
  );
}

export function getSubjectItem(id: number) {
  return defHttp.get({ url: Api.SubjectItem, params: { id } });
}
export function updateCheckSubject(
  id: number,
  checkStatus: string,
  mode: SuccessMessageMode = 'message',
) {
  return defHttp.post(
    { url: Api.updateCheckSubject, params: { id, checkStatus } },
    {
      successMessageMode: mode,
    },
  );
}
export function upDateSubjectRecycle(
  id: number,
  isRecycle: string,
  mode: SuccessMessageMode = 'message',
) {
  return defHttp.post(
    { url: Api.upDateSubjectRecycle, params: { id, isRecycle } },
    {
      successMessageMode: mode,
    },
  );
}
