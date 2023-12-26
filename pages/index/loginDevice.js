// pages/index/loginDevice.js
const baseService = require('../../utils/sdk/HTTP/baseService');
const deviceService = require('../../utils/sdk/HTTP/deviceService');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverIp: "http://120.24.68.136:8091",
    token: "test",
    channelID: "10000",
    deviceID: "qsxy3nbxzpsx8",
    deviceVersion: "",
    leftRight: 1, //左边left(0)，右边right(1)
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
    console.log('lll---', side)


    


    if (side) {
      this.setData({
        leftRight: side
      });
    }
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
      deviceID: e.detail.value
    });
  },

  inputDeviceVersion(e) {
    this.setData({
      deviceVersion: e.detail.value
    });
  },

  initHttp(e) {
    baseService.initHttpAuthorize({
      data: {
        channelId: this.data.channelID,
        url: this.data.serverIp,
        token: this.data.token
      },
      success: function (res) {
        // open websocket




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

  didSelectLeftRight(e) {
    console.log('didSelectLeftRight--', e)
    this.setData({
      leftRight: e.currentTarget.dataset.side
    });
    wx.setStorageSync('leftRight', e.currentTarget.dataset.side)
  },
  bindDevice(e) {
    deviceService.bind({
      data: {
        deviceId: this.data.deviceID,
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
        deviceId: this.data.deviceID,
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
