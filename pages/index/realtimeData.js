// pages/index/realtimeData.js
const deviceService = require('../../utils/SDK/HTTP/deviceService');
const medicaWebsocketHelper = require('../../utils/SDK/Socket/medicaWebsocketHelper');

const app = getApp();
let medicaBase = app.globalData.medicaBase;
let lm600TcpApi = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: "",
    breathRate: "",
    heartRate: "",
    deviceId: '',
    leftRight: 0,
    deviceType: 0x800C,
    currentStatus: "",
    sid: "",
    userId: "",
    statusStr: '',
    realNumber: 0,


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
    let deviceId = wx.getStorageSync('deviceId')
    let leftRight = wx.getStorageSync('leftRight')
    let userId = wx.getStorageSync('userId')
    let sid = wx.getStorageSync('sid')

    if (deviceId) {
      this.setData({
        deviceId: deviceId,
        leftRight: leftRight,
        realNumber: leftRight,
        sid: sid,
        userId: userId
      })
    }

    let _this = this
    medicaWebsocketHelper.connectWS({
      data: {
        wsUrl: app.globalData.webSoket,
        deviceId: deviceId,
        deviceType: 0x800C,
        leftRight: leftRight,
        sid: sid,
      },
      onSocketOpen: function (client) {
        console.log('onSocketOpen---', client)
        //通过返回client，创建lm600tcpAPI ，websocket操作api
        lm600TcpApi = new medicaBase.LM600TcpApi(client)
        // 注册实时数据监听
        lm600TcpApi.registerRealDataCallback((res, val) => {
          console.log('real---', res, val)
          if (res && res.realDataList) {
            let realdata = res.realDataList[0]
            _this.setData({
              status: realdata.status,
              statusStr: _this.statusString(realdata.status), 
              breathRate: (realdata.status == 5 || realdata.status == 1) ? "--": realdata.breathRate,
              heartRate: (realdata.status == 5 || realdata.status == 1) ? "--": realdata.heartRate,
              realNumber: realdata.serialNumber
            })
          }
        })
      },
      onSocketError: function (res) {
        console.log('onSocketError---', client)
      },
      onSocketClose: function (res) {
        console.log('onSocketClose---', client)
      }
    })
  },

  statusString(status){
    switch (status) {
      case 5:
      return "离床"
        break;
      default:
        return "在床"
        break;
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('--onHide----')
    // socketHelper.closeWS()
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
  /**
 * 开始获取数据
 */
  startRealtimeData() {
    if (lm600TcpApi) {
      lm600TcpApi.startRealData({
        networkDeviceId: this.data.deviceId,
        deviceId: this.data.deviceId,
        deviceType: this.data.deviceType,
        serialNumber: this.data.leftRight,
        handler: function (code) {
          console.log('---startRealtimeData--', code)
          if (code == 0) {
            wx.showModal({
              showCancel: false,
              title: '',
              content: "开始获取数据成功"
            })
          }
          else {
            wx.showModal({
              showCancel: false,
              title: '',
              content: "开始获取数据失败"
            })
          }
        }
      })
    }
  },
  /**
  * 停止获取数据
  */
  stopRealtimeData() {
    if (lm600TcpApi) {
      lm600TcpApi.stopRealData({
        networkDeviceId: this.data.deviceId,
        deviceId: this.data.deviceId,
        deviceType: this.data.deviceType,
        serialNumber: this.data.leftRight,
        handler: function (code) {
          console.log('---stopRealtimeData--', code)
          if (code == 0) {
            wx.showModal({
              showCancel: false,
              title: '',
              content: "停止获取数据成功"
            })
          }
          else {
            wx.showModal({
              showCancel: false,
              title: '',
              content: "停止获取数据失败"
            })
          }
        }
      })
    }
  },

  /**
 * 手动结束监测
 */
  handStopMonitoring() {
    if (lm600TcpApi) {
      lm600TcpApi.stopCollect({
        networkDeviceId: this.data.deviceId,
        deviceId: this.data.deviceId,
        deviceType: this.data.deviceType,
        serialNumber: this.data.leftRight,
        userId: this.data.userId,
        timestamp: new Date().getTime() / 1000,
        handler: function (code) {
          console.log('---stopCollect--', code)
          if (code == 0) {
            wx.showModal({
              showCancel: false,
              title: '',
              content: "手动结束监测成功"
            })
          }
          else {
            wx.showModal({
              showCancel: false,
              title: '',
              content: "手动结束监测失败"
            })
          }
        }
      })
    }
  },
  /**
  * 查询设备状态
  */
  checkDeviceOnline() {
    let _this = this
    deviceService.deviceStatus({
      data: {
        deviceId: this.data.deviceId,
        leftRight: this.data.leftRight
      },
      success: function (res) {
        console.log('----deviceStatus--', res)
        _this.setData({
          currentStatus: res.CONNECTION_STATUS
        })
        wx.showModal({
          showCancel: false,
          title: '',
          content: "查询设备状态成功"
        })
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "查询设备状态失败"
        })
      }
    })
  },
})