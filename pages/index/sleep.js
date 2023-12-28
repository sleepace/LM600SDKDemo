// pages/index/sleep.js
const deviceService = require('../../utils/sdk/HTTP/deviceService');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    columns: [],
    interfereIndex: 0,
    interfereMode: 0,
    interfereModeName: '',
    interfereLevel: 0,
    interfereLevelName: '',
    columns1: ['慢震', '快震', '声音', '声音+慢震', '声音+快震'],
    columns2: ['舒缓', '轻柔', '渐强', '较强', '强'],
    deviceId: '',
    leftRight: 0,
    electricSwitch: 0,//负电位开关状态
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
    console.log('sleep---',deviceId,leftRight)
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
   * 负电位
   */
  negativeElectric() {
    let _this = this
    deviceService.batteryClick({
      data: {
        deviceId: this.data.deviceId,
        status: this.data.electricSwitch,
      },
      success: function (res) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: _this.data.electricSwitch == 1 ? "开启" : "关闭" + "负电位成功"
        })
        _this.setData({
          electricSwitch: !_this.data.electricSwitch
        })
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: (_this.data.electricSwitch == 1 ? "开启" : "关闭") + "负电位失败"
        })
      }
    })
  },


  onChange(event) {
    this.setData({
      leftRight: event.detail.index
    });
    console.log('leftRight-----', this.data.leftRight)

  },

  /**
    * 干预开关
    */
  interfereOnchange(event) {
    console.log('---interfereOnchange-', event)
    let on = event.detail.value
    deviceService.infraredSwitch({
      data: {
        deviceId: this.data.deviceId,
        deviceType: 0x800C,
        leftRight: this.data.leftRight,
        status: on ? 1 : 0,
      },
      success: function (res) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: (on ? "开启" : "关闭") + "干预成功"
        })
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: (on ? "开启" : "关闭") + "干预失败"
        })
      }
    })
  },
  interfereMode() {
    this.setData({ show: true, columns: this.data.columns1, interfereIndex: 0 })

  },
  interfereLevel() {
    this.setData({ show: true, columns: this.data.columns2, interfereIndex: 1 })
  },

  onConfirm(event) {
    if (this.data.interfereIndex == 0) {
      this.setData({ interfereMode: event.detail.index })
    }
    else {
      this.setData({ interfereLevel: event.detail.index })
    }
    this.setData({ show: false })
    this.operateSleepInterfere()
  },

  onCancel() {
    this.setData({ show: false })
  },
  // 干预配置
  operateSleepInterfere() {
    deviceService.setInfraredConfig({
      data: {
        deviceId: this.data.deviceId,
        deviceType: 0x800C,
        leftRight: this.data.leftRight,
        valid: 1,
        mode: this.data.interfereMode,
        level: this.data.interfereLevel
      },
      success: function (res) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "干预配置成功"
        })
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "干预配置失败"
        })
      }
    })
  },

  /**
  * 呼吸异常报警
  */
  breathOnchange(event) {

  },

  /**
* 心率异常报警
*/
  heartOnchange(event) {

  },


  /**
*离床报警
*/
  leftbedOnchange(event) {


  },

})