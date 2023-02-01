import { defHttp } from '/@/utils/http/axios';
import { SuccessMessageMode } from '/#/axios';
enum Api {
  UpdatePwd = '/setting/updatePwd',
}

export function updatePwd(params?: object, mode: SuccessMessageMode = 'message') {
  return defHttp.post(
    { url: Api.UpdatePwd, params },
    {
      successMessageMode: mode,
    },
  );
}
