const router = require('../../router/index.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo_src:'/images/pic/etc-logo.png',
    orderId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const data = router.extract(options);
    if (null != data) {
      that.setData({ orderId: data.orderId })
      wx.navigateToMiniProgram({
        appId: 'wxf027cc32bfa26828',
        path: 'pingan/pages/BindMobile/BindMobile',
        extraData: {
          from: '457620938417392843',
          mobilePhone: wx.getStorageSync("tel"),
          orderId:data.orderId
        },
        envVersion: 'release',
        // envVersion: 'trial',
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
    }
   
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

  },
  opening(){
    var that = this;
    wx.navigateToMiniProgram({
      appId: 'wxf027cc32bfa26828',
      path: 'pingan/pages/BindMobile/BindMobile',
      extraData: {
        from: '457620938417392843',
        mobilePhone: wx.getStorageSync("tel"),
        orderId:that.data.orderId
      },
      envVersion: 'release',
      // envVersion: 'trial',
      success(res) {
        // 打开成功
        console.log(res)
      }
    })
  },
  myETC:function(){
    router.push({name:"myEtc"});
  }
})