// pages/index/realtimeData.js
const deviceService = require('../../utils/SDK/HTTP/deviceService');
const socketHelper = require('../../utils/SDK/Socket/socketHelper');
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
    userId: ""

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
        sid: sid,
        userId: userId
      })
    }

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
        // lm600TcpApi = new medicaBase.LM600TcpApi(client)
        // lm600TcpApi.registerRealDataCallback((res, val) => {
        //   console.log('real---', res, val)
        // })
        medicaWebsocketHelper.registerRealDataCallback((res, val) =>{
          if(res && res.realDataList){
            let realdata = res.realDataList[0]
            this.setData({
              status: realdata.status,
              breathRate: realdata.breathRate,
              heartRate: realdata.heartRate
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
    return;

    if (!app.globalData.webSoketOpen) {
      socketHelper.connectWS({
        data: {
          wsUrl: 'app.globalData.webSoket',
          deviceId: deviceId,
          deviceType: 0x800C,
          leftRight: leftRight
        },
        onSocketOpen: function (res) {
          app.globalData.webSoketOpen = true
          // 登录设备
          socketHelper.login({
            deviceId: deviceId,
            leftRight: leftRight,
            deviceType: 0x800C
          })
        },
        onSocketError: function (res) {
          app.globalData.webSoketOpen = false

        },
        onSocketClose: function (res) {
          app.globalData.webSoketOpen = false
        },
        onSocketMessage: function (res) {
          console.log('onSocketMessage---', res)
          if (res.type == 5000) { // 连接socket 成功

          }
          else if (res.type == 5001) {//实时数据逻辑

          }
          else if (res.type == 5002) {
            console.log(console.log('收到服务器长间歇通知：' + JSON.stringify(res)));
          }
          else if (res.type == 5003) {
            console.log(console.log('收到服务器开始监测通知：' + JSON.stringify(res)));
          }
          else if (res.type == 5004) {
            console.log('收到服务器结束监测通知：' + JSON.stringify(res));
          }
          else if (res.type == 5005) {
            console.log('收到服务器设备上线通知：' + JSON.stringify(res));
          }
          else if (jsonData.type == 5006) {
            console.log('收到服务器设备下线通知：' + JSON.stringify(res));
          }
          else if (jsonData.type == 5007) {
            console.log('收到服务器报告生成通知：' + JSON.stringify(res));
          }
          else if (res.type == 5008) {//自动升级进度

          }
          else if (res.type == 5009) {//助眠状态更新

          }
          else if (jsonData.type == 5011) {
            console.log('收到取消共享通知')
          }
          else if (jsonData.type == 5012) {
            console.log('负电量状态通知', res)
          }
          else {

          }
        }
      })
    }
    else {
      console.log('请连接websocket')
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
    medicaWebsocketHelper.startRealtimeData({
      data: {
        deviceId: this.data.deviceId,
        deviceType:this.data.deviceType,
        leftRight: this.data.deviceId,
      },
      handler: function (res) {
        console.log('---startRealtimeData--', res)
      }
    })

    // if(lm600TcpApi){
    //   lm600TcpApi.startRealData({
    //     deviceId: this.data.deviceId,
    //     deviceType: 0x800C,
    //     serialNumber:  this.data.leftRight,
    //     handler: function (res) {

    //       console.log('---startRealtimeData--', res)
    //     }
    //   })
    // }
  },
  /**
  * 停止获取数据
  */
  stopRealtimeData() {
    // socketHelper.stopRealtimeData({
    //   deviceId: this.data.deviceId,
    //   deviceType: 0x800C,
    //   leftRight: this.data.deviceId,
    // })
    medicaWebsocketHelper.stopRealtimeData({
      data: {
        deviceId: this.data.deviceId,
        deviceType:this.data.deviceType,
        leftRight: this.data.deviceId,
      },
      handler: function (res) {
        console.log('---stopRealtimeData--', res)
      }
    })
  },

  /**
 * 手动结束监测
 */
  handStopMonitoring() {
    medicaWebsocketHelper.stopCollect({
      data: {
        deviceId: this.data.deviceId,
        deviceType:this.data.deviceType,
        leftRight: this.data.deviceId,
        userId: this.data.userId
      },
      handler: function (res) {
        console.log('---stopCollect--', res)
      }
    })
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