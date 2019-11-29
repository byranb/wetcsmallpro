const {
  config,
  req
} = require('../../framework/index.js');
const router = require('../../router/index.js');
const {
  isEmpty,
  isPhone
} = require('../../utils/verification.js')
import Toast from '../../dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    etcCards: [],
    hasDate: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
      })
    }
    this.myEtc();
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

  onClickLeft() {
    router.relaunch({
      name: 'home'
    })
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

  myEtc() {
    req.user.getEtcInfo({
      session_id: wx.getStorageSync('sessionId')
    }).then((res) => {
      console.log(res)
      if (res.code === 0) {
        this.setData({
          etcCards: res.result
        })
      } else {
        Toast(res.message);
      }
      this.setData({
        hasDate: true
      })
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  },
  currentRecord(event) {
    var that = this;
    let state = event.currentTarget.dataset.state
    switch (state) {
      case "1":
        req.user.pay({
          orderId: event.currentTarget.dataset.orderId
        }).then((res) => {
          console.log(res)
          if (res.code === 0) {
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
                  router.replace({
                    name: 'order',
                    data: {
                      orderId: event.currentTarget.dataset.orderId
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
            req.err.show("服务出小差了");
          });
        break;
      case "2":
        router.push({
          name: 'order',
          data: {
            orderId: event.currentTarget.dataset.orderId
          }
        });
        break;
      case "3":
        // let vehicleOwnerServiceState = event.currentTarget.dataset.vehicleState;
        // if (0 == vehicleOwnerServiceState) {
          //跳转双签
          wx.navigateToMiniProgram({
            appId: 'wxf027cc32bfa26828',
            path: 'pingan/pages/BindMobile/BindMobile',
            extraData: {
              from: '457620938417392843',
              mobilePhone: wx.getStorageSync("tel"),
              orderId: event.currentTarget.dataset.orderId
            },
            envVersion: 'release',
            // envVersion: 'trial',
            success(res) {
              // 打开成功
              console.log(res)
            }
          })
        // }else{
        //   Toast("当前卡片审核中，请耐心等待");
        // }
        break;
      case "5":
        router.push({
          name: 'consumption',
          data: {
            vehiclePlate: event.currentTarget.dataset.vehiclePlate
          },
        });
        break;
      case "6":
        router.push({
          name: 'order',
          data: {
            orderId: event.currentTarget.dataset.orderId,
            event: "edit"
          }
        });
        break;
      case "7":
        
        break;
    }
  }
})