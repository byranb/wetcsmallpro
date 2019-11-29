const router = require('../../router/index.js');
const {
  config,
  req
} = require('../../framework/index.js');
const {
  isEmpty,
  isPhone
} = require('../../utils/verification.js')
const {
  apiUrl
} = require('../../config/index.js');
const app = getApp();

import Toast from '../../dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRec: false,
    agreeText: '已阅读并同意《河南微ETC用户服务协议》',
    agreement: !0,
    originalPrice: 288,
    price: 99,
    isSpeical: !0,
    isBind: !1,
    phone: '',
    chooseSize: false,
    etcApplyExplain: apiUrl + "/img/hnetcapply.png?" + Math.random()/9999,
    isAgreement: false,
    showKeyboard: false,
    currentIndex: -1,
    carNoStr: '',
    carNo: ['', '', '', '', '', '', '', '']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (wx.getStorageSync('tel')) {
      that.setData({
        phone: wx.getStorageSync('tel'),
        isBind: !0
      })
    }
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
    this.setData({
      isRec: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.setData({
      isRec: false
    })
  },
  onClickLeft(){
    router.relaunch({
      name: 'home'
    })
  },
  agreeAgreement() {
    if (this.data.agreement) {
      this.setData({
        agreement: !1
      })
    } else {
      this.setData({
        agreement: !0
      })
    }
  },
  showAgreement() {
    router.push({
      name: 'agreement'
    });
  },

  pay: function() {
    var that = this;
    Toast.loading({
      duration: 0,
      forbidClick: true,
      message: '正在下单...'
    });
    let params = {
      session_id: wx.getStorageSync('sessionId'),
      vehiclePlate: that.data.carNoStr,
      setMealId: 1
    }
    if (wx.getStorageSync("channel")) {
      Object.assign(params, wx.getStorageSync("channel"));
    }
    //创建订单
    req.user.createAndPay(params).then((res) => {
      console.log(res)
      if (res.code === 0) {
        Toast.clear();
        console.log(res);
        let responseData = res.result[0];
        if (!isEmpty(responseData.signType)) {
          //发起微信支付
          wx.requestPayment({
            timeStamp: responseData.timeStamp,
            nonceStr: responseData.nonceStr,
            package: responseData.package,
            signType: responseData.signType,
            paySign: responseData.paySign,
            success(res) {
              console.log(res)
              router.push({
                name: 'order',
                data: {
                  orderId: responseData.orderId
                }
              });
            },
            fail(res) {
              Toast('支付失败')
            }
          })
        } else {
          Toast('支付失败')
        }
      } else {
        Toast(res.message);
      }
    }).catch((err) => {
      Toast.clear();
      req.err.show("服务出小差了");
    });
  },
  recCoupons: function() {
    var that = this;
    if (that.data.carNoStr.length >= 7) {
      if (that.data.agreement) {
        that.pay();
      } else {
        Toast("请阅读并同意《河南微ETC用户服务协议》")
      }
    } else {
      Toast("车牌号码格式有误，请检查")
    }
  },
  resClose: function() {
    this.setData({
      isRec: false
    })
  },
  getPhoneNumber(e) {
    var that = this;
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
      req.user.bindMobilePhone(params).then((res) => {
        console.log(res)
        if (res.code === 0) {
          var phone = res.result[0].mobilePhone
          wx.setStorageSync("tel", phone);
          that.setData({
            phone: res.result[0].mobilePhone,
            isBind: !0
          })
          this.recCoupons();
        } else {
          Toast(res.message);
        }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
    }
  },

  // 弹出键盘输入车牌 点击的车牌号框的时候
  setCurrentCarNo(e) {
    let index = e.currentTarget.dataset.index;
    index = parseInt(index);
    if (app.globalData.SDKVersion < '2.6.1') {
      let keyboard = this.selectComponent('#keyboard');
      keyboard.indexMethod(index, this.data.currentIndex);
    }
    this.setData({
      currentIndex: index
    });
    if (!this.data.showKeyboard) {
      this.setData({
        showKeyboard: true
      });
      if (app.globalData.SDKVersion < '2.6.1') {
        let keyboard = this.selectComponent('#keyboard');
        keyboard.showMethod(this.data.showKeyboard);
      }
    }
  },
  // 输入车牌是回调
  valueChange(e) {
    if (app.globalData.SDKVersion < '2.6.1') {
      let keyboard = this.selectComponent('#keyboard');
      keyboard.indexMethod(e.detail.index, this.data.currentIndex);
    }
    if(e.detail.index == 8){
      this.setData({
          isSpeical:!1
      })
    }else{
      if(isEmpty(this.data.carNo[7])){
        this.setData({
          isSpeical:!0
        })
      }
    }
    this.setData({
      carNo: e.detail.carNo,
      carNoStr: e.detail.carNo.join(''),
      currentIndex: e.detail.index,
      showKeyboard: e.detail.show
    });
    if (app.globalData.SDKVersion < '2.6.1') {
      let keyboard = this.selectComponent('#keyboard');
      keyboard.showMethod(this.data.showKeyboard);
    }
  }

})