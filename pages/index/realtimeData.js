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
        // lm600TcpApi = new medicaBase.LM600TcpApi(client)
        // lm600TcpApi.registerRealDataCallback((res, val) => {
        //   console.log('real---', res, val)
        // })
        medicaWebsocketHelper.registerRealDataCallback((res, val) =>{
          console.log('res---', res,val)
          if(res && res.realDataList){
            let realdata = res.realDataList[0]
            _this.setData({
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
        leftRight: this.data.leftRight,
      },
      handler: function (code) {
        console.log('---startRealtimeData--', code)
        if (code == 0){

        }
        else{

        }
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
    medicaWebsocketHelper.stopRealtimeData({
      data: {
        deviceId: this.data.deviceId,
        deviceType:this.data.deviceType,
        leftRight: this.data.leftRight,
      },
      handler: function (code) {
        console.log('---stopRealtimeData--', code)
        if (code == 0){

        }
        else{
          
        }
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
        leftRight: this.data.leftRight,
        userId: this.data.userId
      },
      handler: function (code) {
        console.log('---stopCollect--', code)
        if (code == 0){

        }
        else{
          
        }
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