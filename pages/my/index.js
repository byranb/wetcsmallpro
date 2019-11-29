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
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: '',
    avatarUrl: '',
    nickName: '',
    phone: '',
    qrBase:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
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
    var that = this;
    // if (typeof this.getTabBar === 'function' &&
    //   this.getTabBar()) {
    //   this.getTabBar().setData({
    //     selected: 2
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
        phone: phone
      })
    }
    that.getUserInfo();
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  onShareAppMessage() {
    return config.shareData;
  },
  getUserInfo() {
    var that = this;
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      that.setData({
        userInfo: userInfo,
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
      })
    } else {
      that.setData({
        avatarUrl: "/images/pic/head.png",
      })
    }
    let tel = wx.getStorageSync('tel')
    if (tel) {
      that.setData({
        phone: tel
      })
    }
  },

  toSettings: function() {
    router.push({
      name: "settings"
    });
  },
  bindGetUserInfo(e) {
    var that = this;
    console.log(e.detail.userInfo)
    let route = e.currentTarget.id;
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo);
      this.setData({
        userInfo: e.detail.userInfo,
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName
      })
    }
    if (that.data.phone) {
      switch (route) {
        case 'money':
          router.push({
            name: 'money'
          });
          break;
        case 'club':
          router.push({
            name: 'club'
          });
          break;
        case 'bill':
          router.push({
            name: 'waiting',
            data: {
              title: '申请发票'
            }
          });
          break;
        case 'integral':
          router.push({
            name: 'waiting',
            data: {
              title: '我的积分'
            }
          });
          break;
        case 'customer':
          router.push({
            name: 'customer'
          });
          break;

      }
    }
  },
  getPhoneNumber(e) {
    var that = this;
    let route = e.currentTarget.id;
    if (e.detail.encryptedData) {
      let params = {
        ivdata: e.detail.iv,
        encrypdata: e.detail.encryptedData,
        nickname: wx.getStorageSync("userInfo").nickName
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
            haveTel: res.result[0].mobilePhone
          })
          if (that.data.userInfo) {
            switch (route) {
              case 'money':
                router.push({
                  name: 'money'
                });
                break;
              case 'club':
                router.push({
                  name: 'club'
                });
                break;
              case 'bill':
                router.push({
                  name: 'waiting',
                  data: {
                    title: '申请发票'
                  }
                });
                break;
              case 'integral':
                router.push({
                  name: 'waiting',
                  data: {
                    title: '我的积分'
                  }
                });
                break;
              case 'customer':
                router.push({
                  name: 'customer'
                });
                break;
            }
          }
        } else {
          Toast(res.message);
        }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
    }
  },
  toPush(e) {
    let route = e.currentTarget.id;
    switch (route) {
      case 'money':
        router.push({
          name: 'money'
        });
        break;
      case 'club':
        router.push({
          name: 'club'
        });
        break;
      case 'bill':
        router.push({
          name: 'waiting',
          data: {
            title: '申请发票'
          }
        });
        break;
      case 'integral':
        router.push({
          name: 'waiting',
          data: {
            title: '我的积分'
          }
        });
        break;
      case 'customer':
        router.push({
          name: 'customer'
        });
        break;
      case 'qrcode':
        this.getHDQRcodeForClub();
        break;
    }
  },
  getHDQRcodeForClub(){
    var that = this;
    Toast.loading({
      duration:0,
      forbidClick: true, 
      message: '下载中...'
    });
    let path = wx.getStorageSync("qr_HD_code");
    if (isEmpty(path)){
       that.getHDQRcodeForClubURL();
    }else{
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success: res => {
          Toast.clear();
        },
        fail: err => {
          Toast("保存失败")
        }
      });
    }
  },
  getHDQRcodeForClubURL(){
    var that = this;
    req.user.getHDQRcodeForClub({
      session_id: wx.getStorageSync("sessionId")
    }).then((res) => {
      console.log(res);
      if (res.code === 0) {
        that.setData({
          qrBase: res.result[0].imgbase64
        })
        that.saveQRcode();
      } else {
        Toast(res.message);
      }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  },
  saveQRcode(){
    var that = this;
    // 指定图片的临时路径
    let path = `${wx.env.USER_DATA_PATH}/qr_HD_img.png`;
    // 把base64的图片转化成ArrayBuffer数据
    const buffer = wx.base64ToArrayBuffer(that.data.qrBase);
    // 获取小程序的文件系统
    const fsm = wx.getFileSystemManager();
    // 把arraybuffer数据写入到临时目录中
    fsm.writeFile({
      filePath: path,
      data: buffer,
      encoding: 'binary',
      success: (res) => {
        console.log(path)
        // 把临时路径下的图片，保存至相册
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: res => {
            Toast.clear();
          },
          fail: err => { Toast("保存失败") }
        });
        //缓存到本地
        fsm.saveFile({
          tempFilePath: path,
          success(res) {
            console.log('图片缓存成功', res.savedFilePath)
            wx.setStorageSync('qr_HD_code', res.savedFilePath)
          },
          fail(res) {
            console.log(res)
          }
        })
      },
      fail: (err) => { Toast(err); }
    });
  }
})