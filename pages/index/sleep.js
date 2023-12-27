// pages/index/sleep.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    show: false,
    columns: [],
    interfereIndex: 0,
    interfereMode: 0,
    interfereModeName: '',
    interfereLevel: 0,
    interfereLevelName: '',
    columns1: ['慢震', '快震', '声音', '声音+慢震', '声音+快震'],
    columns2: ['舒缓', '轻柔', '渐强', '较强', '强']
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
   * 负电位
   */
  negativeElectric() {


  },
  /**
    * 干预开关
    */
  interfereOnchange(event) {

  },

  onChange(event) {
    this.setData({
      active: event.detail.index
    });
    console.log('active-----', this.data.active)

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
  },

  onCancel() {
    this.setData({ show: false })
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