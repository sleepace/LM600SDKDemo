// app.js
let medicaBase = require('./utils/SDK/index.common.js')
var language = require('./utils/language.js');

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.getSystemInfo({
      success: (res)=> {
        console.log("getSystemInfo", res)
        this.globalData.statusBarHeight = res.statusBarHeight;
        let lang = res.language.toLowerCase();
        language.initLanguage(lang);
      }
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
	host: '',
    tcpHost: '',
    tcpPort: '',
    webSoket: '',
    header:{
      channelId: 10000,
      appVe: 10000,
      status: 3
		},
    userInfo: null,
    medicaBase: medicaBase,
    loginCode: '',
    appVersion: "1.0.0",
    webSoketOpen:false,
  }
})
