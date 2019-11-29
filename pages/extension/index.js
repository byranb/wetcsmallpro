
const router = require('../../router/index.js');
const {
  config,
  req
} = require('../../framework/index.js');
import Toast from '../../dist/toast/toast';

// let mockData = [
//   { memberName: 'laobi', handleTime: '2019-01', state:'1'},
//   { memberName: '11', handleTime: '2019-01', state: '2' },
//   { memberName: 'la22obi', handleTime: '2019-301', state: '1'},
//   { memberName: '33', handleTime: '2019-013', state: '4' },
//   { memberName: '44', handleTime: '2019-012', state: '3' },
//   { memberName: '44', handleTime: '2019-012', state: '6' },
//   { memberName: '44', handleTime: '2019-012', state: '0' },
//   { memberName: '44', handleTime: '2019-012', state: '3' },
//   { memberName: '44', handleTime: '2019-012', state: '2' },
//   { memberName: '44', handleTime: '2019-012', state: '1' },
// ]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:0,
    pageSize:10,
    haveMore:true,
    totalCount: 0,
    count:0,
    lastMonthCount:0,
    thisMonthCount:0,
    consumptionList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      pageNum: 0,
      consumptionList: []
    })
    that.myExtensionRecord();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.haveMore) {
      that.myExtensionRecord();
    }
  },

  myExtensionRecord(){
    var that = this;
    that.setData({
      pageNum: that.data.pageNum + 1
    })
    req.user.myExtensionRecord({
      session_id: wx.getStorageSync('sessionId'),
      pageNum: that.data.pageNum,
      pageSize:that.data.pageSize
    }).then((res) => {
      console.log(res)
      if (res.code === 0) {
        let consumptions = that.data.consumptionList.concat(res.result[0].memberList);
        that.setData({
          consumptionList: consumptions,
          count: res.result[0].count,
          lastMonthCount:res.result[0].lastMonthCount,
          thisMonthCount:res.result[0].thisMonthCount
        })
        if(res.result.length < 10) {
          that.setData({haveMore:false})
        }
      } else {
        Toast(res.message);
      }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  }

})