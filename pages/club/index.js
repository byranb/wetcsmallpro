const router = require('../../router/index.js');
const {
  config,
  req
} = require('../../framework/index.js');
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
    isShow: true,
    isRec: false,
    codeArray: ['', '', '', '', '', ''],
    hasClub: false,
    clubCode: '',
    clubName: '',
    vipLev:1,
    qrBase: '',
    qrImage: '',
    vipGrade:'VIP会员',
    extensionUrl: '',
    hasDate:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.myClub();
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
  inputDelete: function(e) {
    let codeArr = this.data.codeArray;
    const findIndex = codeArr.filter(e => e != '');
    if ('0' === findIndex) return;
    codeArr[findIndex.length - 1] = '';
    this.setData({
      codeArray: codeArr,
      clubCode: codeArr.join('')
    })
  },
  inputChange: function(e) {
    let codeArr = this.data.codeArray;
    if (null != e.detail) {
      console.log("insert val：" + JSON.stringify(e))
      const findIndex = codeArr.findIndex(e => e == '');
      if ('-1' === findIndex) return;
      codeArr[findIndex] = e.detail;
      this.setData({
        codeArray: codeArr,
        clubCode: codeArr.join('')
      })
    }
  },
  confirmJoin(){
    var that = this;
    that.setData({
      hasClub: true,
      isShow: false,
      isRec: false,
      vipLev: 1
    })
   
  },
  showDialog: function() {
    if (this.data.clubCode.length < 6) {
      Toast("请输入完整的ETC俱乐部卡号");
      return;
    }
    this.setData({
      isRec: true
    })
  },
  canerJoin: function() {
    this.setData({
      isRec: false
    })
  },
  joinClub: function() {
    this.joinETCClubs();
  },
  myClub() {
    var that = this;
    req.user.myClub({
      sessionId: wx.getStorageSync("sessionId"),
    }).then((res) => {
      if (res.code === 0) {
        console.log(res)
        if (!isEmpty(res.result[0].clubCode)) {
          that.setData({
            clubCode: res.result[0].clubCode,
            clubName: res.result[0].clubName,
            vipLev: res.result[0].vipLev,
            hasClub: true,
            isShow: false,
          })
          this.getQrCode();
        }
      } else {
        Toast(res.message);
      }
      that.setData({
        hasDate: true
      })
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  },
  refleshClubQR(){
    wx.removeStorageSync('qr_code');
    this.getQrCode();
  },
  joinETCClubs() {
    var that = this;
    req.user.joinClub({
      sessionId: wx.getStorageInfo("sessionId"),
      clubCode: that.data.clubCode
    }).then((res) => {
      console.log(res)
      if (res.code === 0) {
        that.setData({
          isRec: false
        })
        that.myClub();    
      } else {
        that.setData({
          isRec: false,
        })
        Toast(res.message);
      }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  },
  exitClub(){
    var that = this;
    that.setData({
      isRec: false
    })
    req.user.exitClub({
      sessionId: wx.getStorageInfo("sessionId"),
      clubCode: that.data.clubCode
    }).then((res) => {
      console.log(res)
      if (res.code === 0) {
        that.setData({
          hasClub: false,
          isShow: true,
          clubCode: '',
          clubName: '',
          qrBase: '',
          qrImage: '',
          codeArray: ['', '', '', '', '', '']
        })
        Toast('已退出俱乐部!');
      } else {
        Toast(res.message);
      }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  },
  levelVIP(){
    var that = this;
    req.user.memberUpgrade({
      sessionId: wx.getStorageInfo("sessionId"),
      clubCode: that.data.clubCode
    }).then((res) => {
      console.log(res)
      if (res.code === 0) {
        that.setData({
          vipLev: 2
        })
        Toast('恭喜，您已成功升级VIP会员!');
      } else {
        Toast(res.message);
      }
      }).catch((err) => {
        req.err.show("服务出小差了");
      });
  },
  myExtension: function() {
    router.push({
      name: 'extension'
    });
  },
  getQrCode() {
    var that = this;
    const path = wx.getStorageSync("qr_code");
    if (!isEmpty(path)) {
      that.setData({
        qrImage: path
      })
    } else {
      that.getQrCodeUrl();
    }

  },
  getQrCodeUrl() {
    var that = this;
    let userInfo = wx.getStorageSync("userInfo")
    Toast.loading({
      duration: 0,
      forbidClick: true,
      message: '加载中...'
    });
    req.user.getQRcodeForClub({
      sessionId: wx.getStorageSync("sessionId"),
      txUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName
    }).then((res) => {
      console.log(res)
      if (res.code === 0) {
        that.setData({
          qrBase: res.result[0].imgbase64,
          qrImage: 'data:image/png;base64,'+res.result[0].imgbase64
        })
        Toast.clear();
        const sysInfo = wx.getSystemInfoSync()
        if (sysInfo.platform == 'android'){
          that.saveClubPic(res.result[0].imgbase64);
        }
      } else {
        Toast(res.message);
      }
      }).catch((err) => {
        Toast.clear();
        req.err.show("服务出小差了");
      });
  },
  saveClubPic(qrBase) {
    var that = this;
    // 指定图片的临时路径
    const tempFilePath = `${wx.env.USER_DATA_PATH}/qr_img.png`;
    // 把base64的图片转化成ArrayBuffer数据
    const buffer = wx.base64ToArrayBuffer(qrBase);
    // 获取小程序的文件系统
    const fsm = wx.getFileSystemManager();
    // 把arraybuffer数据写入到临时目录中
    fsm.writeFile({
      filePath: tempFilePath,
      data: buffer,
      encoding: 'binary',
      success: (res) => {
        console.log(res)
        fsm.saveFile({
          tempFilePath: tempFilePath,
          success(res) {
            console.log('图片缓存成功', res.savedFilePath)
            wx.setStorageSync('qr_code', res.savedFilePath)
            that.setData({
              qrImage: res.savedFilePath
            })
          },
          fail(res) {
            console.log(res)
          }
        })
      },
      fail: (err) => {
        Toast(err);
      }
    });
  },
  savePic() {
    var that = this;
    let path = wx.getStorageSync("qr_code");
    if(isEmpty(path)){
      // 指定图片的临时路径
      path = `${wx.env.USER_DATA_PATH}/qr_img.png`;
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
              Toast("保存成功")
            },
            fail: err => { Toast("保存失败") }
          });
        },
        fail: (err) => { Toast(err); }
      });
    }else{
      wx.saveImageToPhotosAlbum({
          filePath: path,
          success: res => {
            Toast("保存成功")
          },
          fail: err => {
            Toast("保存失败")
          }
        });
    }
  }


})