const {
  config,
  req
} = require('../../framework/index.js');
const router = require('../../router/index.js');
import Toast from '../../dist/toast/toast';

// let mockData = [
//   {
//     money:20,
//     couponName:'洗车券',
//     couponDesc:'在线办理，3分钟搞定!',
//     state:0,
//     canUse:0
//   },
//   {
//     money: 50,
//     couponName: '高速通行券',
//     couponDesc: '在线办理，3分钟搞定!',
//     state: 0,
//     canUse: 1
//   },
//   {
//     money: 30,
//     couponName: '洗车券',
//     couponDesc: '在线办理，3分钟搞定!',
//     state: 0,
//     canUse: 0
//   },
//   {
//     money: 80,
//     couponName: '代驾券',
//     couponDesc: '在线办理，3分钟搞定!',
//     state: 0,
//     canUse: 1
//   },
//   {
//     money: 10,
//     couponName: '停车券',
//     couponDesc: '在线办理，3分钟搞定!在线办理，3分钟搞定!',
//     state: 0,
//     canUse: 0
//   }
// ]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isRec: false,
    toUse:false,
    couponList: [],
    hasDate: false,
    currentMoney:'',
    currentCouponName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myCouponList();
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
    this.setData({
      isRec: false,
      toUse: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      isRec: false,
      toUse: false
    })
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

  },
  myCouponList() {
    // Toast.loading({
    //   mask: true,
    //   message: '加载中...'
    // });
    req.user.myCouponList({
      session_id:wx.getStorageSync("sessionId")
    }).then((res) => {
      console.log(res)
      if (res.code === 0) {
        this.setData({
          couponList: res.result,
        })
        // Toast.clear();
      } else {
        Toast(res.message);
      }
      this.setData({
        hasDate: true
      })
      }).catch((err) => {
        req.err.show("服务出小差了");
      });//Toast("服务器出小差了")
  },
  recCoupons: function (event) {
    let currentMoney = event.currentTarget.dataset.money;
    let currentCouponName = event.currentTarget.dataset.couponName;
    this.setData({
      isRec: true,
      currentMoney:currentMoney,
      currentCouponName: currentCouponName
    })
  },
  resClose: function () {
    this.setData({
      toUse: false
    })
  },
  resCloseMoney:function(){
    this.setData({
      isRec: false
    })
  },
  applyETC(){
    router.push({ name: 'apply' });
  },
  toUse(){
    // router.push({name:'useCoupons'});
    this.setData({
      toUse: true
    })
  }
})