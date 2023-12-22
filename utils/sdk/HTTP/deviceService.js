const baseService = require('./baseService.js')
const app = getApp();

/*
名称： 设备列表
参数：
  {
    user: app.globalData.users[0]
  }
返回结果
http://172.14.1.100:91/apps/panel/apis/apis.html#/apiDetail/62
*/
function deviceList(params){
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.devicelist;
  baseService.request(_params);
}
/**
 * 设备列表(左右两侧)
 * 参数：{user: app.globalData.users }
 */
function deviceListAll(params){
  var pros = params.users.map((val,idx)=>{
    return new Promise((resolve, reject) => {
      deviceList({
        user: val,
        success(response){
          resolve(response)
        },
        fail(){
          reject(...arguments)
        },
        sleepaceFail(){
          reject(...arguments)
        }
      })
    })
  })
  return new Promise((resolve, reject) => {
    Promise.all(pros).then((data)=>{
      var arr = [data[0][0], data[1][0]];
      resolve(arr)
    }).catch(()=>{
      reject(...arguments)
    })
  })
}

/*
名称： 设备绑定
参数：
  {
    user: app.globalData.users[0],
    data: {
      deviceId:
      deviceName:
      deviceType:
      leftRight:
    }
  }
*/
function bind(params)
{
  const _params = Object.assign({}, params);

  _params.url = baseService.urlList.device.bind;
  baseService.request(_params);
}

/*
名称： 设备解绑
参数：
  {
    user: app.globalData.users[0],
    data: {
      deviceId:
      deviceName:
      deviceType:
      leftRight:
    }
  }
*/
function unbind(params)
{
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.unbind;
  baseService.request(_params);
}

/**
 * 设备解绑(左右)
 * 参数：{ user: app.globalData.users, devices: [] }
 */
function unbindAll(params) {
  var pros = params.users.map((val, idx) => {
    return new Promise((resolve, reject) => {
      unbind({
        user: val,
        data: {
          deviceId: params.devices[idx].deviceId,
          deviceName: params.devices[idx].deviceName,
          deviceType: params.devices[idx].deviceType,
          leftRight: idx
        },
        success(response) {
          resolve(response)
        },
        fail() {
          reject(...arguments)
        },
        sleepaceFail() {
          reject(...arguments)
        }
      })
    })
  })
  return new Promise((resolve, reject) => {
    Promise.all(pros).then((data) => {
      var arr = [data[0], data[1]];
      resolve(arr)
    }).catch(() => {
      reject(...arguments)
    })
  })
}

/*
名称： 设备信息更新（昵称，性别）
参数：
  {
    user: app.globalData.users[0],
    data: {
      deviceId:
      deviceType:
      nickName:
      gender:
      macAddr:
      wifiName:
    }
  }
*/
function infoUpdate(params)
{
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.infoUpdate;
  baseService.request(_params);
}

/*
名称： 设置(用于Reston)
参数：
  {
    user: app.globalData.users[0],
    data: {
      deviceId:
      deviceType:
      startHour:'	设置自动监测 - 开始-小时'
      startMinute:'设置自动监测 - 开始-分钟'
      flag:'设置自动监测 - 开关 0关 1开'
      weekday:'设置自动监测 - 周 位与计算：00000001 表示星期一，00000010 星期二，依此类推'
    }
  }
*/
function setConfigReston(params)
{
  const _params = Object.assign({}, params);
  
  if (! _params.data.sceneId)
  {
    _params.data.sceneId = 100;
  }
  
  _params.url = baseService.urlList.device.setConfigReston;
  baseService.request(_params);
}

/*
名称： 获取设置（自动开始）
参数：
  {
    user: app.globalData.users[0],
    data: {
      deviceId:
      deviceType:
    }
  }
*/
function getConfig(params)
{
  const _params = Object.assign({}, params);

  if (!_params.data.sceneId) {
    _params.data.sceneId = 100;
  }

  _params.url = baseService.urlList.device.getConfig;
  baseService.request(_params);
}

/*
名称： 设备状态（是否在线，监测状态）
参数：
  {
    user: app.globalData.users[0],
    data: {
      deviceId:
      deviceType:
      leftRight:
    }
  }

返回结果
{}查不到设备信息

*/
function deviceStatus(params)
{
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.deviceStatus;
  baseService.request(_params);
}

/**
 * 设备助眠状态
 */
function deviceAidStatus(params){
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.deviceAidStatus;
  baseService.request(_params);
}

/**
 * 设备状态(左右)（是否在线，监测状态）
 * 参数：{ user: app.globalData.users }
 */
function deviceStatusAll(params) {
  var pros = params.users.map((val, idx) => {
    return new Promise((resolve, reject) => {
      deviceStatus({
        user: val,
        data: {
          deviceId: params.devices[idx].deviceId,
          deviceType: params.devices[idx].deviceType,
          leftRight: idx
        },
        success(response) {
          resolve(response)
        },
        fail() {
          reject(...arguments)
        },
        sleepaceFail() {
          reject(...arguments)
        }
      })
    })
  })
  return new Promise((resolve, reject) => {
    Promise.all(pros).then((data) => {
      var arr = [data[0], data[1]];
      resolve(arr)
    }).catch(() => {
      reject(...arguments)
    })
  })
}

/**
 * 预览助眠模式
 */
function sleepAidPreview(params){
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.sleepAidPreview;
  baseService.request(_params);
}
/**
 * 预览干预模式
 */
function sleepIntervenePreview(params){
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.sleepIntervenePreview;
  baseService.request(_params);
}

/*
名称： 开启乐眠助眠设备
参数：
  {
    user: app.globalData.users[0],
    data: {
      deviceId:
      deviceType:
      leftRight:
      opt: "0:关闭，1：开始"
    }
  }

返回结果
{}查不到设备信息

*/
function zhongmaiSleepAid(params)
{
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.zhongmaiSleepAid;
  baseService.request(_params);
}

/*
名称： 负电量开关设置
参数：
  {
    user: app.globalData.users[0],
    data: {
      deviceId:
      status : (0,关，1、开)
    }
  }

返回结果
{}查不到设备信息

*/
function batteryClick(params)
{
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.batterySwitchSet;
  baseService.request(_params);
}


/*
名称： 获取负电量开关
参数：
  {
    user: app.globalData.users[0],
    data: {
      deviceId:
    }
  }
*/
function getBatterySwitch(params) {
  const _params = Object.assign({}, params);

  _params.url = baseService.urlList.device.getBatterySwitch;
  baseService.request(_params);
}

module.exports = {
  deviceList: deviceList,
  deviceListAll: deviceListAll,
  deviceAidStatus: deviceAidStatus,
  deviceStatus: deviceStatus,
  deviceStatusAll: deviceStatusAll,
  unbind: unbind,
  unbindAll: unbindAll,
  bind: bind,
  infoUpdate: infoUpdate,
  setConfigReston: setConfigReston,
  getConfig: getConfig,
  zhongmaiSleepAid: zhongmaiSleepAid,
  sleepAidPreview: sleepAidPreview,
  sleepIntervenePreview: sleepIntervenePreview,
  batteryClick: batteryClick,
  getBatterySwitch: getBatterySwitch
}


