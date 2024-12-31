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
        fail(err){
          reject(...arguments)
        },
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
名称： 设置单双人配置
参数：
  {
    sid: 可选（option）,
    data: {
      deviceId:
      useType：单双人模式 1：单人，2：双人
    }
  }
*/
function setUseType(params)
{
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.setUseType;
  baseService.request(_params);
}


/*
名称： 查询单双人配置
参数：
  {
    sid: 可选（option）,
    data: {
      deviceId:
    }
  }
*/
function getUseType(params)
{
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.getUseType;
  baseService.request(_params);
}

/*
名称： 根据设备查询绑定状态，同时返回单双人配置
参数：
  {
    sid: 可选（option）,
    data: {
      deviceId:
    },
    response:{
		"status":0,	//0成功：5找不到设备 2服务器错误
		"msg":"",
		"data":{
			"device":{ //本设备信息
				"deviceId":"xxxx",
				"deviceName":"XXXX",
				"deviceType":56,
				"useType":1 
			},
			"userDevices":[ //本设备绑定信息，如未绑定设备，返回为空数组
				{
					"deviceId":"xxxx",
					"deviceName":"XXXX",
					"deviceType":56,
					"leftRight":0,
          "userId":"xxxxxx",
          "useType":1 
				}
			]
		}
  }
*/
function bindInfo(params)
{
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.bindInfo;
  baseService.request(_params);
}

/*
名称： 设备绑定
参数：
  {
    sid: 可选（option）,
    data: {
      deviceId:
      deviceName:
      deviceType:
      leftRight:
      useType：单双人模式 1：单人，2：双人
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
    sid: 可选（option）,
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
 * 参数：{ devices: [] }
 */
function unbindAll(params) {
  var pros = params.devices.map((val, idx) => {
    return new Promise((resolve, reject) => {
      unbind({
        data: {
          deviceId: params.devices[idx].deviceId,
          deviceName: params.devices[idx].deviceName,
          deviceType: params.devices[idx].deviceType,
          leftRight: params.devices[idx].leftRight,
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
    data: {
      leftRight:
      deviceId:
      deviceType:
      wifiName:
      custom:
      nickName:
      gender:
      macAddr:
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
名称： 设备状态（是否在线，监测状态）
参数：
  {
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

/*
 * 设备助眠状态
 data: {
      deviceId:
      deviceType:
      leftRight:
    }
 */
function deviceAidStatus(params){
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.deviceAidStatus;
  baseService.request(_params);
}

/**
 * 设备状态(左右)（是否在线，监测状态）
 * 参数：{ devices: []}
 */
function deviceStatusAll(params) {
  var pros = params.devices.map((val, idx) => {
    return new Promise((resolve, reject) => {
      deviceStatus({
        data: {
          deviceId: params.devices[idx].deviceId,
          deviceType: params.devices[idx].deviceType,
          leftRight: params.devices[idx].leftRight
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
  预览助眠模式
  参数：
  {
    data: {
      deviceId:
      deviceType:
      leftRight:
      aidMode: 
      aidLevel:
    }
  }
 */
function sleepAidPreview(params){
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.sleepAidPreview;
  baseService.request(_params);
}


/**
 预览干预模式
   参数：
  {
    data: {
      deviceId:
      deviceType:
      leftRight:
      interveneFlag: //干预开关 0:关，1：开
      interveneMode:  //干预模式
      interveneLevel: //干预等级
    }
  }
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
function sleepAid(params)
{
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.sleepAid;
  baseService.request(_params);
}

/*
名称： 负电量模式设置
参数：
  {
    data: {
      deviceId:
      mode://0 自动（默认） 1 手动
    }
  }

返回结果
{}查不到设备信息

*/
function saveNegativeChargeMode(params)
{
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.saveNegativeChargeMode;
  baseService.request(_params);
}


/*
名称： 获取负电量模式
参数：
  {
    data: {
      deviceId:
    }
  }
*/
function getNegativeChargeMode(params) {
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.getNegativeChargeMode;
  baseService.request(_params);
}

/*
名称： 红外温度通知
参数：
  {
    data: {
      deviceId:
      deviceType:
      leftRight:
      status: (0,关，1、开)
    }
  }
*/
function infraredSwitch(params) {
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.infraredSwitch;
  baseService.request(_params);
}

/*
名称： 红外温度配置
参数：
  {
    data: {
      deviceId:
      deviceType:
      leftRight:
      valid: (/0:无效， 1:有效)
      mode:干预模式 模式：1--5
      level:干预等级 等级：1--5
    }
  }
*/
function setInfraredConfig(params) {
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.setInfraredConfig;
  baseService.request(_params);
}

/*
名称： 红外温度配置获取
参数：
  {
    data: {
      deviceId:
      leftRight:
    }
  }
*/
function getInfraredConfig(params) {
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.getInfraredConfig;
  baseService.request(_params);
}

/*
名称： 助眠音乐配置设置
参数：
  {
    data: {
      deviceId:
      leftRight:
      deviceType:
      status: 1 //播放/停止:0:停止， 1:播放
      musicId: 1 //播放指定曲目:曲目：1--x
      recycle: 0 //循环模式:0:单曲循环， 1:列表循环 2: 随机循环
      time: 30  //定时停止:(1--120)分钟
      volume: 5 //音量1-5
    }
  }
*/
function setMusicConfig(params) {
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.setMusicConfig;
  baseService.request(_params);
}

/*
名称： 助眠音乐配置获取
参数：
  {
    data: {
      deviceId:
      leftRight:
      deviceType:
    }
  }
  respnse 返回参数和设置参数一致
*/
function getMusicConfig(params) {
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.getMusicConfig;
  baseService.request(_params);
}

/*
 * 设置报警时间段
  参数：
 data:{
  deviceId:
  deviceType:
  leftRight:
  ranges:[ //最多设置5个时间段
    {
          "start":495,	//8:15
          "end":626		//10:26
    }
  ]
}
 */
function setAlarmTimeRange(params) {
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.setAlarmTimeRange;
  baseService.request(_params);
}

/*
 * 获取报警时间段
  参数：
 data:{
  deviceId:
  deviceType:
  leftRight:
}
response返回数据和设置一样
 */
function getAlarmTimeRange(params) {
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.device.getAlarmTimeRange;
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
  sleepAid: sleepAid,
  sleepAidPreview: sleepAidPreview,
  sleepIntervenePreview: sleepIntervenePreview,
  saveNegativeChargeMode: saveNegativeChargeMode,
  getNegativeChargeMode: getNegativeChargeMode,
  infraredSwitch: infraredSwitch,
  setInfraredConfig: setInfraredConfig,
  getInfraredConfig: getInfraredConfig,
  setMusicConfig: setMusicConfig,
  getMusicConfig: getMusicConfig,
  setAlarmTimeRange: setAlarmTimeRange,
  getAlarmTimeRange: getAlarmTimeRange,
  setUseType: setUseType,
  getUseType: getUseType,
  bindInfo: bindInfo

}


