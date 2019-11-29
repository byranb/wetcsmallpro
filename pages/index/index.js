const {
  config,
  req
} = require('../../framework/index.js');
const router = require('../../router/index.js');
const { isEmpty, isPhone } = require('../../utils/verification.js')
const userInfoKey = 'userInfo';
import Toast from '../../dist/toast/toast';

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: '',
    haveTel:'',
    userPhone: '',
    imgUrls: [
      '/images/pic/ad.png'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    isSign:0,
    signInfo:{
          signNum:0,
          continuSignNum:0,
          fraction:0,
          lastSignTime:""
    }
  },
  onLoad(query) {
    var that = this;
    // let drainageType = query.drainageType;
    // let channelId = query.channelId;
    // let channelMemberId = query.channelMemberId;
    // if (undefined != drainageType && undefined != channelId){
    //   let channel = {};
    //   channel.drainageType = drainageType;
    //   channel.channelId = channelId;
    //   channel.channelMemberId = channelMemberId;
    //   wx.setStorageSync("channel", channel);
    // }
    that.getUserInfo();
    that.getSignInfo();
  },
  onShow: function () {
    var that = this;
    // if (typeof this.getTabBar === 'function' &&
    //   this.getTabBar()) {
    //   this.getTabBar().setData({
    //     selected: 0
    //   })
    // }

    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      that.setData({
        userInfo: userInfo,
      })
    }
    let phone = wx.getStorageSync('tel')
    if (phone) {
      that.setData({
        haveTel: phone
      })
    }

  },
  onShareAppMessage() {
    return config.shareData;
  },
  getBannerList() {
    req.user.getBannerList()
      .then((res) => {
        if (res.code === 0) {
          console.log(res);
          this.setData({
            imgUrls:res.result
          })
        } else {
          req.err.show(res);
        }
      }).catch((err) => {
        req.err.show("服务出小差了");
      }); 
  },
  getUserInfo() {
    var that = this;
    req.user.getUserInfo()
      .then((res) => {
        console.log(res);
        if (res.code === 0) {
          if (!isEmpty(res.result[0].mobilePhone)){
            wx.setStorageSync("tel", res.result[0].mobilePhone);
            that.setData({
              haveTel:res.result[0].mobilePhone
            })
          }else{
            wx.removeStorageSync("tel");
          }
        } else {
          Toast(res.message);
        }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  },
  getPhoneNumber(e) {
    var that = this;
    let route = e.currentTarget.id;
    if (e.detail.encryptedData) {
      let userInfo = wx.getStorageSync("userInfo")
      let params = {
        ivdata: e.detail.iv,
        encrypdata: e.detail.encryptedData,
        nickname: userInfo.nickName
      };
      if (wx.getStorageSync("channel")) {
        Object.assign(params, wx.getStorageSync("channel"));
      }
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '获取中...'
      });
      req.user.bindMobilePhone(params).then((res) => {
        console.log(res)
        if (res.code === 0) {
          var phone = res.result[0].mobilePhone
          wx.setStorageSync("tel", phone);
          that.setData({
            haveTel: res.result[0].mobilePhone
          })
          Toast.clear();
          if(that.data.userInfo){
            switch (route) {
              case 'apply':
                router.push({ name: 'apply' });
                break;
              case 'card':
                router.push({ name: 'myEtc' });
                break;
              case 'help':
                router.push({ name: 'help' });
                break;
            }
          }
        } else {
          Toast(res.message);
        }
      }).catch((err) => {
        Toast.clear();
        req.err.show("服务出小差了");
      });
    }
  },
  //获取签到信息
  getSignInfo(){
    var that = this;
    req.user.getSignInfo()
      .then((res) => {
        if (res.code === 0) {
          console.log(res);
          that.setData({
            signInfo: res.result[0],
            isSign:res.result[0].isSign
          })
        } else {
          Toast(res.message);
        }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  },
  toPush(e){
    let route = e.currentTarget.id;
    switch (route) {
      case 'apply':
        router.push({ name: 'apply' });
        break;
      case 'card':
        router.push({ name: 'myEtc' });
        break;
      case 'help':
        router.push({ name: 'help' });
        break;
    }
  },

  bindGetUserInfo(e) {
    var that = this;
    console.log(e.detail)
    let route = e.currentTarget.id;
    if(e.detail.userInfo){
      let userInfo = wx.getStorageSync(userInfoKey)
      if (!userInfo) {
        wx.setStorageSync(userInfoKey, e.detail.userInfo);
        that.setData({
          userInfo: e.detail.userInfo,
        })
        // router.push({ name: 'login' });
      }
      if(that.data.haveTel){
        switch(route){
          case 'apply':
            router.push({ name: 'apply' });
            break;
          case 'card':
            router.push({ name: 'myEtc'});
            break;
          case 'help':
            router.push({ name: 'help' });
            break;
          }
      }
    }
  },
  getFractionBySign(){
    var that = this;
    req.user.getFractionBySign()
      .then((res) => {
        if (res.code === 0) {
          console.log(res);
          that.getSignInfo();
        } else {
          Toast(res.message);
        }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  },
  sign() {
    var that = this;
    if(that.data.isSign == 1){
      Toast("今日已经签到，请勿重复签到~")
      return;
    }
    that.getFractionBySign();
     // router.push({ name: 'login' });
  }

});