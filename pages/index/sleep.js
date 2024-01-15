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
    interfereLevel: 0,
    interfereModeName: '',
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
    // 红外
    infraredFlag: 0, //红外开关
    infraredMode: 0,  //红外模式
    infraredLevel: 0, //红外等级0~50
    columns3: ['模式1', '模式2', '模式3', '模式4', '模式5'],
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
    this.getAlert()
    this.getIntervene()
    this.getBatterySwitch()
    this.getInfrared()
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
        status: this.data.electricSwitch == 1 ? 0 : 1,
      },
      success: function (res) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: (_this.data.electricSwitch == 1 ? "关闭" : "开启") + "负电位成功"
        })
        _this.setData({
          electricSwitch: _this.data.electricSwitch == 1 ? 0 : 1
        })
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: (_this.data.electricSwitch == 1 ? "关闭" : "开启") + "负电位失败"
        })
      }
    })
  },
  getBatterySwitch() {
    let _this = this
    deviceService.getBatterySwitch({
      data: {
        deviceId: this.data.deviceId,
      },
      success: function (res) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "获取负电位成功"
        })
        if (res) {
          _this.setData({
            electricSwitch: res.status == 1 ? 1 : 0
          })
        }
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "获取负电位失败"
        })
      }
    })
  },
  onChange(event) {
    this.setData({
      leftRight: event.detail.index
    });
    console.log('leftRight-----', this.data.leftRight)
    this.getAlert()
    this.getIntervene()
    this.getInfrared()
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
    this.setData({ show: false })
    switch (this.data.interfereIndex) {
      case 0:
        {
          this.setData({ interfereMode: event.detail.index })
          this.operateSleepInterfere()
        }
        break;
      case 1:
        {
          this.setData({ interfereLevel: event.detail.index })
          this.operateSleepInterfere()
        }
        break;
      case 2: {
        this.setData({ infraredMode: event.detail.index })
        this.setInfrared()
      }
        break;
      default:
        break;
    }
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
   * 红外干预开关
   */
  infraredOnchange(e) {
    let on = e.detail.value
    this.setData({
      infraredFlag: on
    });
    deviceService.setInfraredConfig({
      data: {
        deviceId: this.data.deviceId,
        deviceType: 0x800C,
        leftRight: this.data.leftRight,
        valid: on ? 1 : 0,
        mode: this.data.infraredMode + 1,
        level: this.data.infraredLevel
      },
      success: function (res) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: (on ? "开启" : "关闭") + "红外干预成功"
        })
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: (on ? "开启" : "关闭") + "红外干预失败"
        })
      }
    })
  },

  infraredMode() {
    this.setData({ show: true, columns: this.data.columns3, interfereIndex: 2 })
  },
  inputinfraredLevel(e) {
    console.log('e.detail.value----',e.detail.value)
    if(e.detail.value && e.detail.value != this.data.infraredLevel){
      this.setData({
        infraredLevel: e.detail.value
      });
      this.setInfrared()
    }
  },
  // 红外干预设置
  setInfrared() {
    deviceService.setInfraredConfig({
      data: {
        deviceId: this.data.deviceId,
        deviceType: 0x800C,
        leftRight: this.data.leftRight,
        valid: this.data.infraredFlag,
        mode: this.data.infraredMode + 1,
        level: this.data.infraredLevel
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
    let _this = this
    userExtService.getAlert({
      data: {
        deviceId: this.data.deviceId,
        leftRight: this.data.leftRight,
      },
      success: function (res) {
        if (res) {
          _this.setData({
            leaveBedAlert: res.leaveBedAlert,
            heartAlert: res.heartAlert,
            breathAlert: res.breathAlert,
          })
        }
        else {
          _this.setData({
            leaveBedAlert: 0,
            heartAlert: 0,
            breathAlert: 0,
          })
        }
        // wx.showModal({
        //   showCancel: false,
        //   title: '',
        //   content: "获取预警配置成功"
        // })
      },
      fail(err) {
        // wx.showModal({
        //   showCancel: false,
        //   title: '',
        //   content: "获取预警配置失败"
        // })
      }
    })
  },
  getIntervene() {
    let _this = this
    userExtService.getIntervene({
      data: {
        deviceId: this.data.deviceId,
        leftRight: this.data.leftRight,
      },
      success: function (res) {
        console.log('getIntervene----', res)
        if (res) {
          _this.setData({
            interfereFlag: res.interveneFlag,
            interveneMode: res.interveneMode > 0 ? res.interveneMode - 1 : 0,
            interveneLevel: res.interveneLevel > 0 ? res.interveneLevel - 1 : 0,
          })
        } else {
          _this.setData({
            interfereFlag: 0,
            interveneMode: 0,
            interveneLevel: 0,
          })
        }
        wx.showModal({
          showCancel: false,
          title: '',
          content: "获取干预配置成功"
        })
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "获取干预配置失败"
        })
      }
    })
  },
  getInfrared(){
    let _this = this
    deviceService.getInfraredConfig({
      data: {
        deviceId: this.data.deviceId,
        leftRight: this.data.leftRight,
      },
      success: function (res) {
        console.log('getInfrared----', res)
        if (res) {
          _this.setData({
            infraredFlag: res.valid,
            infraredMode: res.mode > 0 ? res.mode - 1 : 0,
            infraredLevel: res.level ,
          })
        } else {
          _this.setData({
            infraredFlag: 0,
            infraredMode: 0,
            infraredLevel: 0,
          })
        }
        wx.showModal({
          showCancel: false,
          title: '',
          content: "获取红外干预配置成功"
        })
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "获取红外干预配置失败"
        })
      }
    })
  }
})