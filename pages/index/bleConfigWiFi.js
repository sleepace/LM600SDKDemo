// pages/index/bleConfigWiFi.js
import DeviceType from "../../utils/SDK/DeviceType";

const app = getApp()
const language = require('../../utils/language.js');
import bleWifiConfigHelper from "../../utils/SDK/BleWifiConfigHelper.js";
import util from "../../utils/util.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // serverIp: "120.24.68.136",
    // serverPort: 29012,
    serverIp: "",
    serverPort: "",
    ssid: "",
    password: "",
    device: null,
    lang: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      lang: language.langData(),
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.startWifi({
      success: (res)=>{
        console.log("startWifi suc:" + res.errMsg)
        wx.getConnectedWifi({
          success: (res)=>{
            let wifiName = res.wifi.SSID;
            console.log("getConnectedWifi--------" + wifiName)
            this.setData({ssid: wifiName})
          },
          fail: (res)=>{
            console.log("getConnectedWifi fail:" + res.errMsg)
          }
        })
      },
      fail: (res)=>{
        console.log("startWifi fail:" + res.errMsg)
      }
    })
  },

  toUTF8(str) {
    var result = new Array();
    var k = 0;
    for (var i = 0; i < str.length; i++) {
      var j = encodeURI(str[i]);
      if (j.length == 1) { //未转换的字符
        result[k++] = j.charCodeAt(0);
      } else { // 转换成%XX情势的字符
        var bytes = j.split("%");
        for (var l = 1; l < bytes.length; l++) {
          result[k++] = parseInt("0x" + bytes[l]);
        }
      }
    }
    return result;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  selectDevice(){
    console.log("index selectDevice----------");
    wx.navigateTo({
      url: 'searchDevice',
    })
  },

  inputServerIp(e){
    this.setData({
      serverIp: e.detail.value
    });
  },


  inputServerPort(e){
    this.setData({
      serverPort: e.detail.value
    });
  },

  inputSsid(e){
    this.setData({
      ssid: e.detail.value
    });
  },

  inputPassword(e){
    this.setData({
      password: e.detail.value
    });
  },

  configWifi(){
    //console.log("index configWifi----------", bleWifiConfigHelper, util);
    if(this.data.device){
      // let isValidIP = util.isValidIP(this.data.serverIp);
      if(!this.data.serverIp){
        wx.showModal({
          title: '提示',
          content: '服务器IP或域名不能为空',
          confirmText: '确定',
          showCancel: false
        })
        return;
      }

      if(!this.data.serverPort || this.data.serverPort > 65535){
        wx.showModal({
          title: '提示',
          content: '服务器端口错误',
          confirmText: '确定',
          showCancel: false
        })
        return;
      }

      if(!this.data.ssid && !DeviceType.isM901L(this.data.device.deviceType)){
        wx.showModal({
          title: '提示',
          content: 'WiFi名称错误',
          confirmText: '确定',
          showCancel: false
        })
        return;
      }

      if(!this.data.password && !DeviceType.isM901L(this.data.device.deviceType)){
        wx.showModal({
          title: '提示',
          content: 'WiFi密码不能为空',
          confirmText: '确定',
          showCancel: false
        })
        return;
      }

      wx.showLoading({
        title: '配网中...',
      })

      let ssidRaw = null;
      if(this.data.ssid){
        ssidRaw = this.toUTF8(this.data.ssid);
      }

      console.log("bleWiFiConfig---------", this.data, typeof this.data.device.deviceType)
      bleWifiConfigHelper.bleWiFiConfig(this.data.device.deviceType, this.data.device.deviceId, this.data.serverIp, this.data.serverPort,
        this.data.ssid, ssidRaw, this.data.password, (res, obj)=>{
          console.log("bleWiFiConfig res:" + res+",deviceInfo:" + JSON.stringify(obj))
          wx.hideLoading();
          if(res){
            wx.showModal({
              title: '提示',
              content: '配网成功',
              confirmText: '确定',
              showCancel: false
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '配网失败',
              confirmText: '确定',
              showCancel: false
            })
          }
        }
      );
    }else{
      wx.showModal({
        title: '提示',
        content: '请先选择要配网的设备',
        confirmText: '确定',
        showCancel: false
      })
    }
  },

})