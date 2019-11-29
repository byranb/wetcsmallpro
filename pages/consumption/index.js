const {
  config,
  req
} = require('../../framework/index.js');
const router = require('../../router/index.js');
import Toast from '../../dist/toast/toast';

// let mockDate = [
//   {
//     listNo:1,
//     reciveTime:'2019-05-04',
//     inStationName:'郑州',
//     inOpTime:'2019-05-04 21:42',
//     stationName:'三门峡南',
//     opTime:'2019-05-04 21:42',
//     amout:'15',
//     discountAmount:'10',
//     highwayAmount:'25'
//   }
// ]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    currentDate: new Date().getTime(),
    popup: false,
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    consumptionList: [],
    vehiclePlate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    const data = router.extract(options);
    that.setData({
      vehiclePlate: data.vehiclePlate
    })
    this.getCurrentRecord();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  getCurrentRecord() {
    var that = this;
    req.user.getCurrentRecord({
      session_id: wx.getStorageSync('sessionId'),
      vehiclePlate: that.data.vehiclePlate,
      queryMonth: that.data.currentYear + '-' + that.data.currentMonth
    }).then((res) => {
      console.log(res)
      if (res.code === 0) {
        that.setData({
          consumptionList: res.result[0].list,
          total: res.result[0].totalAmout
        })
      } else {
        Toast(res.message);
      }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  },

  popupShow: function() {
    this.setData({
      popup: true
    })
  },
  popupClose() {
    this.getCurrentRecord();
    this.setData({
      popup: false,
    });
  },

  onInput(event) {
    console.log(event.detail)
    this.setData({
      currentDate: event.detail
    });
  },
  onChange(event) {
    this.setData({
      currentYear: event.detail.getColumnValue(0),
      currentMonth: event.detail.getColumnValue(1)
    })
  }



})