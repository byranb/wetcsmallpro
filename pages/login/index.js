const CountTime = require("../../utils/countTime.js");
const {
  config,
  req
} = require('../../framework/index.js');
const {
  isPhone,
  isEmpty
} = require('../../utils/verification.js');
const router = require('../../router/index.js');
import Toast from '../../dist/toast/toast';
import WxValidate from "../../utils/WxValidate";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    flag: false,
    code: '',
    sms:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.time = new CountTime(this);

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

  // 获取手机号码
  changePhone(e) {
    this.setData({
      phone: e.detail
    })
  },
  changeSms(e) {
    this.setData({
      sms: e.detail
    })
  },
  // 获取验证码
  getCodeData() {
    req.common.sendVCode({
      phoneNum: this.data.phone,
      busiType: 1
    }).then((res) => {
      console.log(res)
      if (res.code === 0) {
        Toast('验证码已发送');
      } else {
        Toast(res.msg);
      }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  },
  // 调用验证码获取倒计时方法
  getCode() {
    if (isPhone(this.data.phone)) {
      if (!this.data.flag) {
        this.time.countTime();
        // 获取验证码
        this.getCodeData();
      } else {
        // req.err.show(`请不要急躁，${this.time.time}s后再次获取！`);
        Toast(`请不要急躁，${this.time.time}s后再次获取！`)
      }
    } else {
      Toast('手机号码格式不正确，请重新输入');
      // req.err.show('手机号码格式不正确，请重新输入！');
    }
  },
  getPhoneNumber(e) {
    var that = this;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv) 
    console.log(e.detail.encryptedData)
    //解密获得手机号
    // that.setData({
    //   phone: enData.phoneNumber
    // })
    // req.user.bindMobillePhone({
    //   sessionId: wx.getStorageInfo("sessionId"),
    //   mobilePhone: that.data.phone,
    //   smsVCode: that.data.sms
    // }).then((res) => {
    //   console.log(res)
    //   if (res.code === 0) {
    //     router.replace({
    //       name: "index",
    //       type: 'tab'
    //     })
    //   } else {
    //     Toast(msg.err);
    //   }
    // }).catch(Toast("服务器出小差了"));

  },

  login() {
    var that = this;
    if (isEmpty(that.data.phone)) {
      Toast('手机号不能为空');
      return;
    }
    if (isEmpty(that.data.sms)) {
      Toast('验证码不能为空');
      return;
    }
    if(!isPhone(that.data.phone)){
      Toast('手机号码格式不正确，请重新输入');
      return;
    }
    req.user.bindMobillePhone({
      sessionId: wx.getStorageInfo("sessionId"),
      mobilePhone: that.data.phone,
      smsVCode: that.data.sms
    }).then((res) => {
      console.log(res)
      if (res.code === 0) {
        router.replace({
          name: "index",
          type: 'tab'
        })
      } else {
        Toast(msg.err);
      }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  },

})