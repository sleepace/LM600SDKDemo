const baseService = require('./baseService.js')


/*
名称： 获取预警配置
参数：
{

}

SUCCESS返回结果
{
    "breathAlert": 1,
    "createTime": "2018-03-20 00:00:00",
    "deviceAlert": 0,
    "heartAlert": 0,
    "leaveBedAlert": 1,
    "mobile": "1",
    "mobileWay": 0,
    "updateTime": "2018-03-20 10:13:20",
    "userId": 25556,
    "wechatWay": 1
}
*/
function getAlert(params) {
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.user.getAlert;
  baseService.request(_params);
}

/*
  名称： 更新预警配置
  参数：
  {
    data: {
      deviceAlert::'是否打开设备异常预警'
      breathAlert:'是否打开呼吸异常预警'
      heartAlert：:'是否打开心跳异常预警'
      leaveBedAlert:'是否打开离床预警'
      // mobileWay:'是否打开短信通知'
      // mobile:'手机'
      // wechatWay:'是否打开微信通知'
    }
  }

  SUCCESS返回结果
  {
      "breathAlert": 1,
      "createTime": "2018-03-20 00:00:00",
      "deviceAlert": 0,
      "heartAlert": 0,
      "leaveBedAlert": 1,
      "mobile": "1",
      "mobileWay": 0,
      "updateTime": "2018-03-20 10:13:20",
      "userId": 25556,
      "wechatWay": 1
  }
*/
function updateAlert(params) {
  const _params = Object.assign({}, params);

  if (_params.data.mobile && _params.data.mobile.indexOf("****") != -1) {
    delete _params.data.mobile;
  }

  _params.url = baseService.urlList.user.updateAlert;
  baseService.request(_params);
}

/**
 * 获取助眠设置
 */
function getIntervene(params) {
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.user.getIntervene;
  baseService.request(_params);
}

/**
 * 更新助眠设置
 */
function updateIntervene(params) {
  const _params = Object.assign({}, params);

  _params.url = baseService.urlList.user.updateIntervene;
  baseService.request(_params);
}

module.exports = {
  getAlert: getAlert,
  updateAlert: updateAlert,
  getIntervene: getIntervene,
  updateIntervene: updateIntervene
}