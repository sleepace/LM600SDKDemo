const baseService = require('./baseService.js')


/*
名称： 获取预警配置
参数：
{
  deviceId:
  leftRight:
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
      deviceId:
      deviceType:
      leftRight:
      breathAlert:'是否打开呼吸异常预警'
      heartAlert：:'是否打开心跳异常预警'
      leaveBedAlert:'是否打开离床预警'
    }
  }

  SUCCESS返回结果
  {
      "breathAlert": 1,
      "createTime": "2018-03-20 00:00:00",
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
  _params.url = baseService.urlList.user.updateAlert;
  baseService.request(_params);
}

/*
 * 获取睡眠干预
 参数：
{
  deviceId:
  leftRight:
}
 * 
 */
function getIntervene(params) {
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.user.getIntervene;
  baseService.request(_params);
}

/*
 * 更新睡眠干预配置
  参数：
{
  deviceId:
  deviceType:
  leftRight:
  "interveneFlag"://干预开关 0:关，1：开
  "interveneMode":干预模式1~5
  "interveneLevel":干预等级1~5
}
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