
const app = getApp();

const host = app.globalData.host || '';
const channelId = app.globalData.header.channelId || '';
const appVe = app.globalData.header.appVe;
const status = app.globalData.header.status;
const timezone = - (new Date().getTimezoneOffset() * 60);
const sid = ''

const urlList = {
  user:{
    login: host + '/pro/zhongmai/account/login',
    sendCode: host + '/pro/account/user/bind/step1',
    bindMobileEmail: host + '/pro/account/user/bind/step2',
    shareCode: host + '/pro/zhongmai/account/share/code',
    shareAccount: host + '/pro/zhongmai/account/share/account',
    shareAccountInfo: host + '/pro/zhongmai/account/share/account/info',
    cancelShareAccountInfo: host + '/pro/partner/secondary/unShare',
    getAlert: host + '/pro/zhongmai/sleepAlertConf/get',
    updateAlert: host + '/pro/zhongmai/sleepAlertConf/update',
    getIntervene: host + '/pro/zhongmai/sleepAidInterveneConf/get',
    updateIntervene: host + '/pro/zhongmai/sleepAidInterveneConf/update',
    userInfoEdit: host + '/pro/account/user/edit',
    getPhoneCode: host + '/pro/account/user/sendMsg',
    checkPhoneCode: host + '/pro/account/user/code/check'
  },
  device:{
    devicelist: host + '/pro/account/device/info',
    bind: host + '/pro/account/device/bind',
    unbind: host + '/pro/account/device/unbind',
    setConfigReston: host + '/pro/scene/config/reston',
    getConfig: host + '/pro/scene/device/config',
    infoUpdate: host + '/pro/account/device/update',
    deviceStatus: host + '/pro/account/device/status',
    deviceAidStatus: host + '/pro/zhongmai/sleepAidIntervene/getSleepAidStatus',
    zhongmaiSleepAid: host + '/pro/zhongmai/sleepAidInterveneConf/sleepaid',
    sleepAidPreview: host + '/pro/zhongmai/sleepAidIntervene/sleepAidPreview',
    sleepIntervenePreview: host + '/pro/zhongmai/sleepAidIntervene/sleepIntervenePreview',
    batterySwitchSet: host + '/pro/zhongmai/sleepAlertConf/saveNegativeCharge', //负电量开关
    getBatterySwitch: host + '/pro/zhongmai/sleepAlertConf/getNegativeCharge' ///获取负电量状态
  },
  data:{
    dayWeekMonth: host + '/pro/data/dayweekmonth/get',
    friendReport: host + '/pro/zhongmai/dayweekmonth/get',
    sendDayReport: host + '/pro/zhongmai/alert/sendDayReport'
  },
  friends:{
    friendsList: host + '/pro/zhongmai/friend/list',
    friendsRequestList: host + '/pro/zhongmai/friend/request/list',
    agreeFriendsRequest: host + '/pro/zhongmai/friend/agree',
    ignoreFriendsRequest: host + '/pro/zhongmai/friend/ignore',
    delFriends: host + '/pro/zhongmai/friend/del',
    sendFriendsRequest: host + '/pro/zhongmai/friend/request/v2',
    searchFriends: host + '/pro/account/user/search',
    editFriends: host + '/pro/zhongmai/friend/remark',
    addEmeContact: host + '/pro/partner/secondary/addContacts',
    deleteEmeContact: host + '/pro/partner/secondary/deleteContacts',
    getEmeContactList: host + '/pro/partner/secondary/getContactsList'
  },
}

function request(params) {
  var header = {
    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    'S-timezone': timezone,
    'S-channelId': channelId,
    'S-appVer': appVe,
    'S-status': status,
    'Accept-Language': 'zh-cn',
    'S-sid': sid
  }
  if(params.sid)
  {
    header['S-sid']=params.sid;
  }

  wx.request({
    method:'POST',
    url: params.url,
    header: header,
    data: params.data,
    success: function (res) {
      console.group(params.url)
      console.log(new Date().toLocaleString())
      console.log("请求URL：" + params.url)
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
        else if (params.sleepaceFail) {
          params.fail({code: res.data.status,message: res.data.msg});
        }
        // Sleepace逻辑错误且没有sleepaceFail的callback，使用默认事件
        else
        {
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none',
          //   duration: 2000
          // })
        }
      } 
      // 网络失败
      else if (params.fail) {
        params.fail({code: res.statusCode,message: ''});
      }else{
        wx.showToast({
          title: '网络错误，请稍后尝试',
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: function (error) {
      params.fail({code: -1, message: error});
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

function initHttpAuthorize(params){
    if(params.data){
        host = params.data.url
        channelId = params.data.channelId

        const _params = Object.assign({}, params);
        _params.url = ''
        this.request({
            data: {
                token: params.data.token.data,
                channelId: params.data.channelId
            }, 
            url:  '',
            success: function (res) {
                if(params.success){
                    params.success(res)
                }
            },
            fail: function (err) {
                if(params.fail){
                    params.fail(err)
                }
            }
        })
    }
}


module.exports = {
  urlList:urlList,
  request: request,
  initHttpAuthorize: initHttpAuthorize
}