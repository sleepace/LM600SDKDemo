// pages/index/sleepTime.js
const deviceService = require('../../utils/SDK/HTTP/deviceService');

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
    deviceService.getAlarmTimeRange({
      data: {
        deviceId: this.data.deviceId,
        leftRight: this.data.leftRight,
        deviceType: 0x800C,
      },
      success: function (res) {
        if (res) {
          res.ranges.forEach(item => {
            let hour_start = parseInt( item.start / 60)
            let min_start = parseInt( item.start % 60)
            hour_start = hour_start < 10 ? '0' + hour_start : hour_start
            min_start = min_start < 10 ? '0' + min_start : min_start
            let hour_end = parseInt(item.end / 60)
            let min_end = parseInt(item.end % 60)
            hour_end = hour_end < 10 ? '0' + hour_end : hour_end
            min_end = min_end < 10 ? '0' + min_end : min_end
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
  },
  onClose(event) {
    const { position, instance } = event.detail;
    let _this = this
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
          instance.close();
          let index = parseInt(event.target.id)
          let timeArr = this.timeList(this.data.timeList)
           timeArr.splice(index, 1)
           deviceService.setAlarmTimeRange({
            data: {
              deviceId: this.data.deviceId,
              leftRight: this.data.leftRight,
              deviceType: 0x800C,
              ranges: timeArr
            },
            success: function (res) {
              _this.getTimeRange()
              wx.showModal({
                showCancel: false,
                title: '',
                content: "删除时间段成功"
              })
            },
            fail(err) {
              wx.showModal({
                showCancel: false,
                title: '',
                content: "删除时间段失败"
              })
            }
          })
  
        break;
    }
  },
  timeList(list) {
    let arr = []
    list.forEach(item => {
      arr.push({
        start: parseInt(item.startTime.split(':')[0]) * 60 + parseInt(item.startTime.split(':')[1]),
        end: parseInt(item.endTime.split(':')[0]) * 60 + parseInt(item.endTime.split(':')[1])
      })
    });
    return arr
  },
  editTime(){
    console.log('index----',this.data.index)
    wx.navigateTo({
      url: './sleepDuration?edit=1&index=' + this.data.index,
    })

  }
})