// pages/index/sleep.js
const deviceService = require('../../utils/SDK/HTTP/deviceService');
const userExtService = require('../../utils/SDK/HTTP/userExtService');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    columns: [],
    interfereFlag: 0,
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
    /**异常报警 */
    breathAlert: 0,
    heartAlert: 0,
    leaveBedAlert: 0,
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
    console.log('sleep---', deviceId, leftRight)
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
          content: (_this.data.electricSwitch == 1 ? "开启" : "关闭") + "负电位成功"
        })
        _this.setData({
          electricSwitch: _this.data.electricSwitch == 1 ? 0 : 1 
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
    this.setData({
      interfereFlag: on
    })
    userExtService.updateIntervene({
      data: {
        deviceId: this.data.deviceId,
        deviceType: 0x800C,
        leftRight: this.data.leftRight,
        interveneFlag: on ? 1 : 0,
        interveneMode: this.data.interfereMode + 1,
        interveneLevel: this.data.interfereLevel + 1
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
  // 干预
  operateSleepInterfere() {
    userExtService.updateIntervene({
      data: {
        deviceId: this.data.deviceId,
        deviceType: 0x800C,
        leftRight: this.data.leftRight,
        interveneFlag: this.data.interveneFlag,
        interveneMode: this.data.interfereMode + 1,
        interveneLevel: this.data.interfereLevel + 1

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
    let on = event.detail.value
    this.setData({
      breathAlert: on ? 1 : 0
    })
    this.updateAlert()
  },

  /**
* 心率异常报警
*/
  heartOnchange(event) {
    let on = event.detail.value
    this.setData({
      heartAlert: on ? 1 : 0
    })
    this.updateAlert()
  },


  /**
*离床报警
*/
  leftbedOnchange(event) {
    let on = event.detail.value
    this.setData({
      leaveBedAlert: on ? 1 : 0
    })
    this.updateAlert()
  },


  // 更新预警配置
  updateAlert() {
    userExtService.updateAlert({
      data: {
        deviceId: this.data.deviceId,
        deviceType: 0x800C,
        leftRight: this.data.leftRight,
        breathAlert: this.data.breathAlert,
        heartAlert: this.data.heartAlert,
        leaveBedAlert: this.data.leaveBedAlert
      },
      success: function (res) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "更新预警配置成功"
        })
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "更新预警配置失败"
        })
      }
    })
  },
  getAlert() {
    userExtService.getAlert({
      data: {},
      success: function (res) {
        this.setData({
          leaveBedAlert: res.leaveBedAlert,
          heartAlert: res.heartAlert,
          breathAlert: res.breathAlert
        })

        wx.showModal({
          showCancel: false,
          title: '',
          content: "获取预警配置成功"
        })
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "获取预警配置失败"
        })
      }
    })
  }

})