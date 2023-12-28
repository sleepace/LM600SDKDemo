// pages/index/realtimeData.js
const deviceService = require('../../utils/sdk/HTTP/deviceService');

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
    currentStatus: ""

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
    if (deviceId) {
      this.setData({
        deviceId: deviceId,
        leftRight: leftRight
      })
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
    /**
   * 开始获取数据
   */
  startRealtimeData(){

  },
   /**
   * 停止获取数据
   */
  stopRealtimeData(){

  },

    /**
   * 手动结束监测
   */
  handStopMonitoring(){

  },
   /**
   * 查询设备状态
   */
  checkDeviceOnline(){
    let _this = this
    deviceService.deviceStatus({
      data: {
        deviceId: this.data.deviceId,
        leftRight: this.data.leftRight
      },
      success: function (res) {
        console.log('----deviceStatus--',res)
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