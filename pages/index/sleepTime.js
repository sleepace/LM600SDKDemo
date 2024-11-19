// pages/index/sleepTime.js
const deviceService = require('../../utils/SDK/HTTP/deviceService');
const userExtService = require('../../utils/SDK/HTTP/userExtService');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeList: [],
    index: 0,
    deviceId: '',
    leftRight: 0,

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
    // let listStr = wx.getStorageSync('timeList')
    // if (listStr) {
    //   this.setData({
    //     timeList: JSON.parse(listStr)
    //   })
    // }
    let deviceId = wx.getStorageSync('deviceId')
    let leftRight = wx.getStorageSync('leftRight')
    if (deviceId) {
      this.setData({
        deviceId: deviceId,
        leftRight: leftRight
      })
    }
    this.getTimeRange()
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

  addTime() {
    if (this.data.timeList.length >= 5) {
      wx.showModal({
        showCancel: false,
        title: '',
        content: "已达上限，添加失败"
      })
      return
    }
    wx.navigateTo({
      url: './sleepDuration?index=' + this.data.index,
    })
  },

  getTimeRange() {
    let _this = this
    let list = []
    userExtService.getAlarmTimeRange({
      data: {
        deviceId: this.data.deviceId,
        leftRight: this.data.leftRight,
        deviceType: 0x800C,
      },
      success: function (res) {
        if (res) {
          res.ranges.forEach(item => {
            let hour_start = item.start/60 
            let min_start = item.start%60
            hour_start = hour_start < 10 ? '0'+hour_start : hour_start
            min_start = min_start < 10 ? '0'+min_start : min_start
            let hour_end= item.end/60 
            let min_end = item.end%60
            hour_end = hour_end < 10 ? '0'+hour_end : hour_end
            min_end = min_end < 10 ? '0'+min_end : min_end
            list.push({
              startTime: hour_start + ':' + min_start,
              endTime: hour_end + ':' + min_end
            })
          });
          _this.setData({
            timeList: list
          })
          wx.setStorageSync('timeList', JSON.stringify(list))
        }
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "报警时间段获取失败"
        })
      }
    })
  }
})