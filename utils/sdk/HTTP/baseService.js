
const app = getApp();

let host = app.globalData.host || '';
let channelId = app.globalData.header.channelId || '';
let appVe = app.globalData.header.appVe;
let status = app.globalData.header.status;
const timezone = - (new Date().getTimezoneOffset() * 60);
let sid = ''

const urlList = {
  user: {
    getAlert: '/app/sleepAlertConf/get',
    updateAlert: '/app/sleepAlertConf/save',
    getIntervene: '/app/sleepAlertConf/getInterveneConf',
    updateIntervene: '/app/sleepAlertConf/saveInterveneConf',
  },
  device: {
    devicelist: '/app/bindInfo',
    bind: '/app/bind',
    unbind: '/app/unbind',
    batterySwitchSet: '/app/sleepAlertConf/saveNegativeCharge', //负电量开关
    getBatterySwitch: '/app/sleepAlertConf/getNegativeCharge',///获取负电量状态
    infoUpdate: '/app/device/update',
    deviceStatus: '/app/device/status',
    deviceAidStatus: '/app/device/getSleepAidStatus',
    sleepAidPreview: '/app/device/sleepAidPreview',
    sleepAid: '/app/device/sleepaid',
    sleepIntervenePreview: '/app/device/sleepIntervenePreview',
    infraredSwitch: '/app/sleepAlertConf/infraredSwitch',//红外温度通知
    setInfraredConfig: '/app/sleepAlertConf/saveInfraredConfig',//红外温度配置
    getInfraredConfig: '/app/sleepAlertConf/getInfraredConfig',//红外温度配置获取
  },
  data: {
    getDailyReport: '/app/analysis/data',
    getReportScore: '/app/analysis/score'
  },
  token: {
    tokenCheck: '/app/tokenCheck',
  }
}

function request(params) {
  var header = {
    'content-type': 'application/json',
    'Accept': 'application/json',
    'S-timezone': timezone,
    'S-channelId': channelId,
    'S-appVer': appVe,
    'S-status': status,
    'Accept-Language': 'zh-cn',
    'Sid': sid
  }
  if (params.sid) {
    header['Sid'] = params.sid;
  }
  //   if(params.user)
  //   {
  //     header['S-sid']=params.user.sid;
  //   }
  wx.request({
    method: 'POST',
    url: host + params.url,
    header: header,
    data: {
      data: params.data
    },
    success: function (res) {
      console.group(params.url)
      console.log(new Date().toLocaleString())
      console.log("请求URL：" + host + params.url)
      console.log("请求Header：" + JSON.stringify(header));
      console.log("请求参数：" + JSON.stringify(params.data));
      console.log("请求成功：" + JSON.stringify(res.data));
      console.groupEnd(new Date().toLocaleString())
      console.log('返回结果:', res)

      // 网络正常
      if (res.statusCode == 200) {
        // Sleepace也没发生错误
        if (res.data.status == 0 && params.success) {
          params.success(res.data.data);
        }
        else if (res.data.status == 0 && params.success == undefined) {
          // do nothing
        }
        // Sleepace逻辑错误
        else if (params.fail) {
          console.log('-----Sleepace逻辑错误', res)
          params.fail({ code: res.data.status, message: res.data.msg });
        }
        // Sleepace逻辑错误且没有sleepaceFail的callback，使用默认事件
        else {
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none',
          //   duration: 2000
          // })
        }
      }
      // 网络失败
      else if (params.fail) {
        params.fail({ code: res.statusCode, message: '' });
      } else {
        wx.showToast({
          title: '网络错误，请稍后尝试',
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: function (error) {
      console.log('-----ee-',error)
      params.fail({ code: -1, message: error });
    }
  })
}

/*
名称： http初始化授权
参数：
 {
   data: {
     url:
     channelId:
     token: 
   }
 }
*/
function initHttpAuthorize(params) {
  if (params.data) {
    host = params.data.url
    channelId = params.data.channelId
    this.request({
      data: {
        token: params.data.token,
        channelId: params.data.channelId
      },
      url: urlList.token.tokenCheck,
      success: function (res) {
        console.log('----initHttpAuthorize-', res)
        sid = res.sid
        if (params.success) {
          params.success(res)
        }
      },
      fail: function (err) {
        if (params.fail) {
          params.fail(err)
        }
      }
    })
  }
}


module.exports = {
  urlList: urlList,
  request: request,
  initHttpAuthorize: initHttpAuthorize
}