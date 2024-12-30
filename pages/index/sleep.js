// pages/index/sleep.js
const deviceService = require('../../utils/SDK/HTTP/deviceService');
const userExtService = require('../../utils/SDK/HTTP/userExtService');
const medicaWebsocketHelper = require('../../utils/SDK/Socket/medicaWebsocketHelper');
const app = getApp();
let medicaBase = app.globalData.medicaBase;
let lm600TcpApi = null

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
    negativeChargeMode: '0',//负电位开关模式;0 自动（默认） 1 手动
    /**异常报警 */
    breathAlert: 0,
    heartAlert: 0,
    leaveBedAlert: 0,
    // 红外
    infraredFlag: 0, //红外开关
    infraredMode: 0,  //红外模式
    infraredLevel: 1, //红外等级1~5
    columns3: ['模式1', '模式2', '模式3', '模式4', '模式5'],
    inbedTime: 30, //在床时间
    playMode: '0',
    volume: 5,
    countTime: 30, // 倒计时
    columns4: ['曲目1', '曲目2', '曲目3', '曲目4', '曲目5'],
    musicIndex: 0,
    status: 0, //1播放，0停止
    duration: 0,//剩余时长

    useType: 1,

    realNumber: 0,
    infrerdId: null,
    sid: "",
    negativeChargeId: null,
    negativeChargeValue: 0, //0 关；1 开
    negativeChargeModeId: null,
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
    let sid = wx.getStorageSync('sid')

    console.log('sleep---', deviceId, leftRight, useType)
    if (deviceId) {
      this.setData({
        deviceId: deviceId,
        leftRight: leftRight,
        sid: sid,
      })
    }

    if (useType) {
      this.setData({
        useType: useType,
      });
    }

    this.getAlert()
    this.getIntervene()
    this.getNegativeChargeMode()
    // this.getInfrared()
    this.getMusicConfig()

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
        // 注册红外状态监听
        let infrerdId = lm600TcpApi.registeInfraredStateCallback((res, val) => {
          console.log('Infrared---', res, val)
          if (res && res.serialNumber == _this.data.leftRight) {
            _this.setData({
              infraredFlag: res.valid,
            })
            if (res.valid) {
              _this.setData({
                infraredLevel: res.leve
              })
            }
            if(res.musicStatus > 0){
              _this.setData({
                musicIndex:  res.musicStatus-1,
              })
            }
            _this.setData({
              duration: res.duration
            })
          }
        })

         //注册负电位模式监听
         let negativeChargeModeId = lm600TcpApi.registeNegativeChargeModeCallback((res, val) => {
          console.log('negativeCharge mode---', res, val)
          _this.setData({
            negativeChargeMode: JSON.stringify(res.mode),
          })
        })

         //注册负电位监听
        let negativeChargeId = lm600TcpApi.registeNegativeChargeCallback((res, val) => {
          console.log('register negativeCharge---', res, val)
          _this.setData({
            negativeChargeValue: res.status
          })
        })
        _this.setData({
          infrerdId: infrerdId,
          negativeChargeId: negativeChargeId,
          negativeChargeModeId: negativeChargeModeId
        })
        lm600TcpApi.queryInfraredState({
          networkDeviceId: deviceId,
          deviceId: deviceId,
          deviceType: 0x800C,
          serialNumber: leftRight,
          handler: function (code, data) {
            console.log('queryInfraredState----', code, data)
            if (code == 0) {
              if (data && data.serialNumber == _this.data.leftRight) {
                _this.setData({
                  infraredFlag: data.valid,
                  infraredLevel: data.level,
                  duration: data.duration
                })
                if(data.musicStatus > 0){
                  _this.setData({
                    musicIndex:  data.musicStatus-1,
                  })
                }
              }
            }
          }
        })
        lm600TcpApi.queryNegativeCharge({
          networkDeviceId: deviceId,
          deviceId: deviceId,
          deviceType: 0x800C,
          serialNumber: leftRight,
          handler: function (code, data) {
            console.log('queryNegativeCharge----', code, data)
            if (code == 0) {
              _this.setData({
                negativeChargeValue: data.status,
              })
            }
          }
        })
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
    if (this.data.infrerdId) {
      lm600TcpApi.unregisteInfraredStateCallback(this.data.infrerdId)
    }
    if (this.data.negativeChargeId) {
      lm600TcpApi.unregisteNegativeChargeCallback(this.data.negativeChargeId)
    }
    if (this.data.negativeChargeModeId) {
      lm600TcpApi.unregisteNegativeChargeModeCallback(this.data.negativeChargeModeId)
    }
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

  negativeChargeModeChange(val){
    this.saveNegativeChargeMode(val.detail)
  },
  /**
   * 负电位模式配置,mode://0 自动（默认） 1 手动
   */
  saveNegativeChargeMode(value) {
    let _this = this
    deviceService.saveNegativeChargeMode({
      data: {
        deviceId: this.data.deviceId,
        deviceType: 0x800C,
        leftRight: this.data.leftRight,
        mode: parseInt(value)
      },
      success: function (res) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "配置负电位模式成功"
        })
        _this.setData({
          negativeChargeMode: value,
        });
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "配置负电位模式失败"
        })
      }
    })
  },
  getNegativeChargeMode() {
    let _this = this
    deviceService.getNegativeChargeMode({
      data: {
        deviceId: this.data.deviceId,
        deviceType: 0x800C,
        leftRight: this.data.leftRight,
      },
      success: function (res) {
        console.log('getNegativeChargeMode----', res)
        wx.showModal({
          showCancel: false,
          title: '',
          content: "获取负电位开关模式成功"
        })
        if (res) {
          _this.setData({
            negativeChargeMode: JSON.stringify(res.mode),
          })
        }
        console.log('negativeChargeMode----',_this.data.negativeChargeMode )
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "获取负电位开关模式失败"
        })
      }
    })
  },
  // 开，关闭负电位
  openNegativeCharge(val){
    let value = val.currentTarget.dataset.id
    let _this = this
    lm600TcpApi.openNegativeCharge({
      networkDeviceId: this.data.deviceId,
      status: value,
      handler: function (code, data) {
        console.log('openNegativeCharge----', code)
        if (code == 0) {
          wx.showModal({
            showCancel: false,
            title: '',
            content: (value ? "开启" : "关闭") + "负电位成功"
          })
          _this.setData({
            negativeChargeValue: value
          })
        }
        else{
          wx.showModal({
            showCancel: false,
            title: '',
            content: (value ? "开启" : "关闭") + "负电位失败"
          })
        }
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
    // this.getInfrared()
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
        interveneFlag: this.data.interfereFlag,
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
        mode: 0,
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
        mode: 0,
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
    console.log('val---', val.detail)
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
    console.log('val---', val.detail)
    this.setData({
      countTime: parseInt(val.detail.value)
    });
  },

  // sendVolume(){

  // },

  playMusic() {
    this.setData({
      status: 1
    })
    this.setMusicConfig()
  },

  stopMusic() {
    this.setData({
      status: 0
    })
    this.setMusicConfig()
  },
  setMusicConfig() {
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
  getMusicConfig() {
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