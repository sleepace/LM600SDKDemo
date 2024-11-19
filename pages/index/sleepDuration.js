// pages/index/sleepDuration.js
const deviceService = require('../../utils/SDK/HTTP/deviceService');
const userExtService = require('../../utils/SDK/HTTP/userExtService');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: '22:00',
    minHour: 0,
    maxHour: 23,
    indexRow: 0,
    startTime: "22:00",
    endTime: "08:00",

    timeList: [],
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
    let listStr = wx.getStorageSync('timeList')
    if (listStr) {
      this.setData({
        timeList: JSON.parse(listStr)
      })
    }
    let deviceId = wx.getStorageSync('deviceId')
    let leftRight = wx.getStorageSync('leftRight')
    if (deviceId) {
      this.setData({
        deviceId: deviceId,
        leftRight: leftRight
      })
    }  

    console.log('timeList----', this.data.timeList)
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

  changeStartTime() {
    this.setData({
      indexRow: 0,
      currentDate: '22:00'
    })
  },
  changeEndTime() {
    this.setData({
      indexRow: 1,
      currentDate: '08:00'
    })
  },

  onInput(event) {
    if (this.data.indexRow == 0) {
      this.setData({
        currentDate: event.detail,
        startTime: event.detail,
      });
    }
    else {
      this.setData({
        currentDate: event.detail,
        endTime: event.detail,
      });
    }
  },
  saveTime() {
    let time = {
      startTime: this.data.startTime,
      endTime: this.data.endTime,
    }
    let flag = false
    this.data.timeList.forEach(item => {
      let contain = this.isOverlap(item, time)
      if (!contain) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "与其他时间段交叉，保存失败"
        })
        flag = true
        throw Error()
      }
    });
    if (!flag) {
      this.data.timeList.push(time)
      // wx.setStorageSync('timeList', JSON.stringify(this.data.timeList))
      let rangeArray = this.timeList(this.data.timeList)
      userExtService.setAlarmTimeRange({
        data: {
          deviceId: this.data.deviceId,
          leftRight: this.data.leftRight,
          deviceType: 0x800C,
          ranges: rangeArray
        },
        success: function (res) {
          console.log('setTimeRange----', res)
          wx.showModal({
            showCancel: false,
            title: '',
            content: "设置报警时间段成功"
          })
          wx.navigateBack({}); //返回上一页
        },
        fail(err) {
          wx.showModal({
            showCancel: false,
            title: '',
            content: "设置报警时间段失败"
          })
        }
      })
    }
  },
  // 选择时间段是否与检测时间段重叠
  isOverlap(oldTime, newTime) {
    let startTime = parseInt(oldTime.startTime.split(':')[0] + oldTime.startTime.split(':')[1])    //900
    let endTime = parseInt(oldTime.endTime.split(':')[0] + oldTime.endTime.split(':')[1])    //1800
    // 将检测的时间段处理为Int格式判断，同上
    let isStartTime = parseInt(newTime.startTime.split(':')[0] + newTime.startTime.split(':')[1])
    let isEndTime = parseInt(newTime.endTime.split(':')[0] + newTime.endTime.split(':')[1])
    // 如果检测时间段存在，并且选择时间为全天，则肯定重复，这个判断的前提是检测时间段不为空
    if (startTime === endTime) {
      return false
    }
    if (isStartTime < isEndTime) {
      if (startTime < endTime && endTime <= isStartTime) {
        return true
      } else if (isEndTime <= startTime && startTime < endTime) {
        return true
      } else if (startTime > endTime && startTime >= isEndTime && endTime <= isStartTime) {
        return true
      } else {
        return false
      }
    } else if (isStartTime > isEndTime) {
      if (isEndTime <= startTime && startTime < endTime && endTime <= isStartTime) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
    return true
  },
  timeList(list){
    let arr = []
    list.forEach(item => {
      arr.push({
        start:parseInt(item.startTime.split(':')[0])* 60  + parseInt(item.startTime.split(':')[1]) ,
        end: parseInt(item.endTime.split(':')[0])* 60  + parseInt(item.endTime.split(':')[1])
      })
    });
    return arr
  }

})