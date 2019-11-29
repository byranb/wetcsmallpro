const CountTime = require("../../utils/countTime.js");
const router = require('../../router/index.js');
const { config, req } = require('../../framework/index.js');
const { isEmpty,isPhone } = require('../../utils/verification.js')
import Toast from '../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    originalPhone: '',
    flag: false,
    code: '',
    newPhone:'',
    sms:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.time = new CountTime(this);
    var phone = wx.getStorageSync("tel");
    if (!isEmpty(phone)){
    this.setData({
      originalPhone:phone
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
  // 获取验证码
  getCodeData() {
    var that = this;
    req.common.sendVCode({
      phoneNum: that.data.phone,
      busiType: 1
    }).then((res) => {
      console.log(res)
      if (res.code === 0) {
        that.time.countTime();
        Toast('验证码已发送');
      } else {
        Toast(res.message);
      }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  },
  getCode() {
    let phoneCodeVerification = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (phoneCodeVerification.test(this.data.newPhone)) {
      if (!this.data.flag) {
        // 获取验证码
        this.getCodeData();
      } else {
        Toast(`请不要急躁，${this.time.time}s后再次获取！`);
      }
    } else {
      Toast('手机号码格式不正确，请重新输入！');
    }
  },
  bindKeyInput(e) {
    let key = e.currentTarget.dataset.inputName;
    this.setData({
      [key]: e.detail.value
    })
  },
  //修改手机号
  subMer(){
    var that = this;
    if (isEmpty(that.data.newPhone)) {
      Toast('新手机号码不能为空');
      return;
    }
    if (isEmpty(that.data.code)) {
      Toast('验证码不能为空');
      return;
    }
    if (!isPhone(that.data.newPhone)) {
      Toast('新手机号码格式不正确，请重新输入');
      return;
    }
    req.user.changeMobile({
      sessionId: wx.getStorageSync("sessionId"),
      oldPhone: that.data.originalPhone,
      newPhone:that.data.newPhone,
      code: that.data.sms
    }).then((res) => {
      console.log(res)
      if (res.code === 0) {
        Toast('修改成功');
        wx.setStorageSync("tel", that.data.newPhone);
        router.pop({name:'my',type:'tab'})
      } else {
        Toast(res.message);
      }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  }

})