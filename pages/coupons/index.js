const {
  config,
  req
} = require('../../framework/index.js');
const router = require('../../router/index.js');
import Toast from '../../dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isRec:false,
    userInfo: '',
    haveTel: '',
    couponList: [],
    hasDate: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.startPullDownRefresh();
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
    var that = this;
    // if (typeof this.getTabBar === 'function' &&
    //   this.getTabBar()) {
    //   this.getTabBar().setData({
    //     selected: 1
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isRec: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      isRec: false
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.couponList();
    setTimeout(function () {
      wx.stopPullDownRefresh() 
    }, 1500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onShareAppMessage() {
    return config.shareData;
  },
  couponList() {
    let that = this;
    req.user.couponList().then((res) => {
      if (res.code === 0) {
        console.log(res);
        that.setData({
          couponList: res.result,
        })
      } else {
        Toast(res.msg);
      }
      that.setData({
        hasDate: true
      })
    }).catch((err) => {
      req.err.show("服务出小差了");
    });
  },
  receiveCoupon:function(e){
    console.log(e.currentTarget.dataset.state)
    let state = e.currentTarget.dataset.state
    if(0==state){
      Toast("系统未检测成功的ETC订单，请检查你是否已提交申请并支付完成")
    }else{
      this.setData({
        isRec: true
      })
    }
  },
  resClose:function(){
    this.setData({
      isRec:false
    })
  },
  // bindGetUserInfo(e) {
  // //   var that = this;
  // //   console.log(e.detail.userInfo)
  // //   let route = e.currentTarget.id;
  // //   let userInfo = wx.getStorageSync('userInfo')
  // //   if (!userInfo) {
  // //     wx.setStorageSync('userInfo', e.detail.userInfo);
  // //     this.setData({
  // //       userInfo: e.detail.userInfo
  // //     })
  // //   }
  // //   if (that.data.haveTel) {
  // //     router.push({
  // //       name: "apply"
  // //     })
  // //   }
  // // },
  // // getPhoneNumber(e) {
  // //   var that = this;
  // //   let route = e.currentTarget.id;
  // //   if (e.detail.encryptedData) {
  // //     let params = {
  // //       ivdata: e.detail.iv,
  // //       encrypdata: e.detail.encryptedData,
  // //       nickname: wx.getStorageSync("userInfo").nickName
  // //     };
  // //     if (wx.getStorageSync("channel")) {
  // //       Object.assign(params, wx.getStorageSync("channel"));
  // //     }
  // //     req.user.bindMobilePhone(params).then((res) => {
  // //       console.log(res)
  // //       if (res.code === 0) {
  // //         var phone = res.result[0].mobilePhone
  // //         wx.setStorageSync("tel", phone);
  // //         that.setData({
  // //           haveTel: res.result[0].mobilePhone
  // //         })
  // //         if (that.data.userInfo) {
  // //           router.push({
  // //             name: "apply"
  // //           })
  // //         }
  // //       } else {
  // //         Toast(res.message);
  // //       }
  // //     }).catch();
  // //   }
  // // },
  // applyETC:function(){
  //   router.push({
  //     name:"apply"
  //   })
  // }
})