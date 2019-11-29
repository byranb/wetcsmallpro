const QR = require('../../utils/weapp-qrcode.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    qrcodeURL: "",
    codeText: "github.com/Pudon",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.drawImg();
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
  drawImg: function () {
    console.log(this.data.codeText);
    var imgData = QR.drawImg(this.data.codeText, {
      typeNumber: 4,
      errorCorrectLevel: 'M',
      size: 500
    })
    this.setData({
      qrcodeURL: imgData
    })
  }
})