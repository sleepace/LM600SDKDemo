// pages/index/loginDevice.js
const baseService = require('../../utils/SDK/HTTP/baseService');
const deviceService = require('../../utils/SDK/HTTP/deviceService');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // serverIp: "http://120.77.233.171:8093",
    // serverIp: 'https://s171.sleepace.com/lekang',
    // token: "test",
    // channelID: "10000",
    // deviceId: "teiug44lw85n9",
    serverIp: "https://s171.sleepace.com/lekang",
    token: "test",
    channelID: "10000",
    deviceId: "teiug44lw85n9",
    leftRight: 0, //左边left(0)，右边right(1)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {



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
    let side = wx.getStorageSync('leftRight')
    let deviceId = wx.getStorageSync('deviceId')
    let serverIp = wx.getStorageSync('serverIp')
    let token = wx.getStorageSync('token')
    let channelID = wx.getStorageSync('channelID')
    console.log('leftRight---', side, deviceId, serverIp, token, channelID)
    if(deviceId){
      this.setData({
        deviceId: deviceId,
      });
    }
    if(side){
      this.setData({
        leftRight: side ? side : 0,
      });
    }
    if(serverIp){
      this.setData({
        serverIp: serverIp,
      });
    }
    if(token){
      this.setData({
        token: token,
      });
    }
    if(channelID){
      this.setData({
        channelID: channelID,
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('onHide---', this.data.deviceId)
    wx.setStorageSync('deviceId', this.data.deviceId)
    wx.setStorageSync('leftRight', this.data.leftRight)
    wx.setStorageSync('serverIp', this.data.serverIp)
    wx.setStorageSync('token', this.data.token)
    wx.setStorageSync('channelID', this.data.channelID)
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


  inputServerIp(e) {
    this.setData({
      serverIp: e.detail.value
    });
  },

  inputToken(e) {
    this.setData({
      token: e.detail.value
    });
  },

  inputChannelID(e) {
    this.setData({
      channelID: e.detail.value
    });
  },

  inputDeviceID(e) {
    this.setData({
      deviceId: e.detail.value
    });
  },

  // inputDeviceVersion(e) {
  //   this.setData({
  //     deviceVersion: e.detail.value
  //   });
  // },

  initHttp(e) {
    baseService.initHttpAuthorize({
      data: {
        channelId: this.data.channelID,
        url: this.data.serverIp,
        token: this.data.token
      },
      success: function (res) {
        // open websocket
        let tcpServer = res.tcpServer
        // app.globalData.webSoket = "ws://" + tcpServer.ip + ":" + tcpServer.wsPort
        app.globalData.webSoket = "wss://s171.sleepace.com/ws" //暂时写死测试通过校验
        console.log('---ws--', app.globalData.webSoket)
        wx.setStorageSync('sid', res.sid)
        wx.setStorageSync('userId', res.user.userId)
        wx.showModal({
          showCancel: false,
          title: '',
          content: "连接服务器成功"
        })
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "连接服务器失败"
        })
        console.log('initHttpAuthorize fail', err)
      }
    })
  },
  onChange(event) {
    this.setData({
      leftRight: event.detail.index
    });
    wx.setStorageSync('leftRight', event.detail.index)
    console.log('leftRight-----', this.data.leftRight)
  },

  bindDevice(e) {
    deviceService.bind({
      data: {
        deviceId: this.data.deviceId,
        leftRight: this.data.leftRight,
      },
      success: function (res) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "绑定设备成功"
        })
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "绑定设备失败"
        })
        console.log('bindDevice fail', err)
      }
    })

  },
  unbindDevice(e) {
    deviceService.unbind({
      data: {
        deviceId: this.data.deviceId,
        leftRight: this.data.leftRight,
      },
      success: function (res) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "解绑设备成功"
        })
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "解绑设备失败"
        })
        console.log('unbindDevice fail', err)
      }
    })
  }






})
