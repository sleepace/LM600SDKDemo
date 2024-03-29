const deviceService = require('../../utils/SDK/HTTP/deviceService');
const dataService = require('../../utils/SDK/HTTP/dataService');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: "",
    score: "",
    startTimeString: ""
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
* 查询设备状态
*/
  getNewReport() {
    let _this = this
    dataService.getDailyReport({
      data: {
        startTime: parseInt((new Date().getTime())/1000),
        num: 1,
        order: 0,
        deviceType: 0x800C
      },
      success: function (res) {
        console.log('get report---', res)
        let historyArr = res.history
        if (historyArr && historyArr.length) {
          let report = historyArr[0]
          _this.setData({
            score: report.analysis.sleepScore,
            startTime: report.summary.startTime,
            startTimeString: _this.format(report.summary.startTime)
          });
        }
        else {
          wx.showModal({
            showCancel: false,
            title: '',
            content: "暂无报告"
          })
        }
      },
      fail(err) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "获取报告失败"
        })
      }
    })


  },
  format(timestamp) {
    //shijianchuo是整数，否则要parseInt转换
    var date = new Date(parseInt(timestamp)*1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mm = date.getMinutes();
    var s = date.getSeconds();
    return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
  },
  add0(m) { return m < 10 ? '0' + m : m }

})