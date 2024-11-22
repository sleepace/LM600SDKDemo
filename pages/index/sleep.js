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
    inbedTime: 30, //在床时间
    playMode: '0',
    volume: 5,
    countTime: 30, // 倒计时
    columns4: ['曲目1', '曲目2', '曲目3', '曲目4', '曲目5'],
    musicIndex: 0,
    status: 0 , //1播放，0停止
    useType: 1, 
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
    let useType = wx.getStorageSync('useType')

    console.log('sleep---', deviceId, leftRight)
    if (deviceId) {
      this.setData({
        deviceId: deviceId,
        leftRight: leftRight
      })
    }

    if(useType){
      this.setData({
        useType: useType,
      });
    }

    this.getAlert()
    this.getIntervene()
    this.getBatterySwitch()
    this.getInfrared()
    this.getMusicConfig()
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
    this.getMusicConfig()
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
      case 3: {
        this.setData({ musicIndex: event.detail.index, status: 1 })
        this.setMusicConfig()
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
    console.log('e.detail.value----', e.detail.value)
    if (e.detail.value && e.detail.value != this.data.infraredLevel) {
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
        valid: this.data.infraredFlag ? 1 : 0,
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
        leaveBedAlert: this.data.leaveBedAlert,
        inBedTime: this.data.inbedTime
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
            inbedTime: res.inBedTime
          })
        }
        else {
          _this.setData({
            leaveBedAlert: 0,
            heartAlert: 0,
            breathAlert: 0,
            inbedTime: 0
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
  getInfrared() {
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
            infraredLevel: res.level,
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
  },

  inbedOnChange(val) {
    this.setData({
      inbedTime: parseInt(val.detail.value)
    });
    this.updateAlert()
  },

  selectMusic(val) {
    this.setData({ show: true, columns: this.data.columns4, interfereIndex: 3 })
  },

  clickPlayMode(val) {
    console.log('val---',val.detail)
    this.setData({
      playMode: val.detail,
    });
  },

  volumeOnchange(val) {
    this.setData({
      volume: val.detail.value,
    });
  },

  countTimeOnchange(val) {
    console.log('val---',val.detail)
    this.setData({
      countTime: parseInt(val.detail.value)
    });
  },

  // sendVolume(){

  // },

  playMusic(){
    this.setData({
      status: 1
    })
    this.setMusicConfig()
  },

  stopMusic(){
    this.setData({
      status: 0
    })
    this.setMusicConfig()
  },
  setMusicConfig(){
    deviceService.setMusicConfig({
      data: {
        deviceId: this.data.deviceId,
        leftRight: this.data.leftRight,
        deviceType: 0x800C,
        status: this.data.status,
        musicId: this.data.musicIndex + 1,
        recycle: parseInt(this.data.playMode),
        time: this.data.countTime,
        volume: this.data.volume
      },
      success: function (res) {
        console.log('setMusicConfig----', res)
        wx.showModal({
          showCancel: false,
          title: '',
          content: "助眠音乐配置设置成功"
        })
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "助眠音乐配置设置失败"
        })
      }
    })
  },

  /**助眠音乐配置获取*/
  getMusicConfig(){
    let _this = this
    deviceService.getMusicConfig({
      data: {
        deviceId: this.data.deviceId,
        leftRight: this.data.leftRight,
        deviceType: 0x800C,
      },
      success: function (res) {
        console.log('getMusicConfig----', res)
        if (res) {
          _this.setData({
            status: res.status,
            musicIndex: res.musicId - 1,
            playMode: JSON.stringify(res.recycle),
            countTime: res.time,
            volume: res.volume
          })
          wx.showModal({
            showCancel: false,
            title: '',
            content: "获取助眠音乐配置设置成功"
          })
        }
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "获取助眠音乐配置设置失败"
        })
      }
    })
  },
    /*
  报警时间段设置
  */
 jumpToSleepSet() {
  wx.navigateTo({
    url: './sleepTime',
  })
},
})