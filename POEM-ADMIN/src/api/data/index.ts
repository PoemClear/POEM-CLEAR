import { defHttp } from '/@/utils/http/axios';
enum Api {
  DataPost = '/data/dataPost',
}

export function getDataPost() {
  return defHttp.get({ url: Api.DataPost });
}
