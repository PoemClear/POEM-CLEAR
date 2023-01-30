import { defHttp } from '/@/utils/http/axios';

enum Api {
  RecycleBinList = '/recycleBin/recycleBinList',
}

export function recycleBinList(params?: object) {
  return defHttp.get({ url: Api.RecycleBinList, params });
}
