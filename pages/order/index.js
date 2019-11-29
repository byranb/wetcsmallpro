var AreaList = require("../../utils/area.js");
const {
  config,
  req
} = require('../../framework/index.js');
const router = require('../../router/index.js');
const { apiUrl } = require('../../config/index.js');
import Toast from '../../dist/toast/toast';
import WxValidate from "../../utils/WxValidate";

Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    popup:false,
    name:'',
    phone:'',
    address:'',
    province:'',
    city:'',
    county:'',
    pcc:'',
    areaList: AreaList,
    carType: 0,
    personPhotos:[
      { id: 1,  src: '/images/pic/idcard2.png', text:'车主身份证（人像面）',upload:'',isUpload:false},
      { id: 2, src: '/images/pic/idcard1.png', text: '车主身份证（国徽面）', upload: '', isUpload: false },
      { id: 3, src: '/images/pic/license1.png', text: '车主行驶证（正页）', upload: '',isUpload: false },
      { id: 4, src: '/images/pic/license2.png', text: '车主行驶证（副页）', upload: '',isUpload: false},    
    ],
    enterprisePhotos:[
      { id: 1, src: '/images/pic/idcard2.png', text: '身份证（人像面）', upload: '', isUpload: false},
      { id: 2, src: '/images/pic/idcard1.png', text: '身份证（国徽面）', upload: '',isUpload: false },
      { id: 3, src: '/images/pic/license1.png', text: '行驶证（正页）', upload: '',isUpload: false },
      { id: 4, src: '/images/pic/license2.png', text: '行驶证（副页）', upload: '',isUpload: false},   
      // { id: 5, src: '/images/pic/license1.png', text: '驾驶证（正页）', upload: '',isUpload: false },
      // { id: 6, src: '/images/pic/license2.png', text: '驾驶证（副页）', upload: '',isUpload: false },
      { id: 5, src: '/images/pic/license1.png', text: '营业执照', upload: '',isUpload: false },
    ],
    orderId:'',
    channel:!1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.initValidate();
    const data = router.extract(options);
    if (null != data){
      that.setData({ orderId: data.orderId })
      if(null != data.event){
        that.getOrderDetails();
      }
    }
    let channel = wx.getStorageSync("channel");
    if(channel){
      let drainageType = channel.drainageType;
      if(drainageType == 11 || drainageType == 21 || drainageType == 31){
        that.setData({ channel: !0 })
      }
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

  initValidate() {
    let rules = {
      name: {
        required: true,
        maxlength: 10
      },
      phone: {
        required: true,
        tel:true
      },
      pcc: {
        required: true,
      },
      address: {
        required: true,
      }
    }

    let message = {
      name: {
        required: '请输入收货人姓名',
        maxlength: '名字不能超过10个字'
      },
      phone: {
        required: '请输入手机号',
        tel: "请输入正确的手机号码"
      },
      pcc: {
        required: "请选择收货地址",
      },
      address: {
        required: "请输入详细地址",
      }
    }
    //实例化当前的验证规则和提示消息
    this.WxValidate = new WxValidate(rules, message);
  },
  formSubmit: function (e) {
    var that = this;
    let params = e.detail.value;
    if(!that.data.channel){
      if (!this.WxValidate.checkForm(params)) {
        let error = this.WxValidate.errorList[0];
        console.log(error)
        Toast(error.msg);
        return false;
      }
    }
    //校验上传图片
    if (0 === that.data.carType){
      for (var value of that.data.personPhotos) {
        console.log(value);
        if(!value.isUpload){
          Toast("请上传" + value.text);
          return;
        }
      }
    }else{
      for (var value of that.data.enterprisePhotos) {
        console.log(value);
        if (!value.isUpload) {
          Toast("请上传" + value.text);
          return;
        }
      }
    }
    this.submitOrder();
  },
  tabChange(e){
      console.log(e)
      this.setData({carType:e.detail.index})
  },
  popupShow:function(){
      this.setData({
        popup:true
      })
  },
  popupClose() {
    this.setData({ popup: false });
  },
  changeInput(e){
    console.log(e)
    let key = e.currentTarget.dataset.inputName
    this.setData({
      [key]:e.detail.value
    })
  },
  
  onConfirm(event) {
    const { values } = event.detail;
    console.log(values)
    this.setData({
      province:values[0].name,
      city:values[1].name,
      county:values[2].name,
      pcc: values.map(item => item.name).join('/')
    })
    this.setData({ popup: false });
  },

  onCancel(event) {
    this.setData({ popup: false });
  },

  submitOrder:function() {
    var that = this;
    Toast.loading({
      duration: 0,
      forbidClick: true,
      message: '正在提交...'
    });
    req.user.submitOrderInfo({
      session_id: wx.setStorageSync("sessionId"),
      orderId:that.data.orderId,
      mobilePhone:that.data.phone,
      receiverName:that.data.name,
      province: that.data.province,
      city: that.data.city,
      county: that.data.county,
      address: that.data.address
    }).then((res) => {
        console.log(res)
        if (res.code === 0) {
          console.log(res);
          Toast.clear();
          wx.removeStorageSync("channel");
          router.replace({
             name: "orderSuccess",
             data:{
               orderId: that.data.orderId
             }
              })
        } else {
          Toast(res.message);
        }
      }).catch((err) => {
        Toast.clear();
        req.err.show("服务出小差了");
      }); 
    
  },
  chooseImage(event){
    var that = this;
    let index = event.currentTarget.dataset.fileType - 1;
    console.log(index)
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePath = res.tempFilePaths[0];
        Toast.loading({
          duration: 0,
          forbidClick: true,
          message: '上传中...'
        });
        console.log(that.data.orderId)
        req.user.uploadocr({
          filePath: tempFilePath,
          name: 'file',
          formData: {
            session_id: wx.getStorageSync('sessionId'),
            orderId: that.data.orderId,
            fileType: event.currentTarget.dataset.fileType,
          },
        }).then((res) => {
          console.log(res)
          const data = JSON.parse(res)
          if (data.code == 0) {
                if (0 === that.data.carType) {
                  let fileInfos = that.data.personPhotos;
                  fileInfos[index].upload = tempFilePath;
                  fileInfos[index].isUpload = true;
                  that.setData({
                    personPhotos: fileInfos
                  })
                } else {
                  let fileInfos = that.data.enterprisePhotos;
                  fileInfos[index].upload = tempFilePath;
                  fileInfos[index].isUpload = true;
                  that.setData({
                    enterprisePhotos: fileInfos
                  })
                }
                Toast.clear();
          } else {
            Toast(data.message);
          }
          }).catch((err) => {
            Toast.clear();
            req.err.show("服务出小差了");
          }); 
      }
    })
  },
  getOrderDetails(){
    var that = this;
    req.user.getOrderDetails({
      session_id: wx.setStorageSync("sessionId"),
      orderId: that.data.orderId
    }).then((res) => {
      console.log(res)
      if (res.code === 0) {
        console.log(res);
        let resData = res.result[0];
        that.setData({
          name: resData.receiverName,
          phone: resData.mobilePhone,
          province: resData.province,
          city:resData.city,
          county:resData.county,
          address: resData.address
        })
        if (undefined != resData.province){
          that.setData({pcc:resData.province+ "/"+ resData.city+ "/"+resData.county})
        }
        let personPhotos = that.data.personPhotos;
        for (var value of personPhotos) {
          console.log(value);
          let id = value.id;
          switch (id){
            case 1:
              value.upload = resData.referidcardPostive
              value.isUpload = true
            break;
            case 2:
              value.upload = resData.referidcardNegative
              value.isUpload = true
              break;
            case 3:
              value.upload = resData.licenseMainPage
              value.isUpload = true
              break;
            case 4:
              value.upload = resData.licenseVcePage
              value.isUpload = true
              break;
          }
        }
        that.setData({
          personPhotos: personPhotos
        })
      } else {
        Toast(res.message);
      }
      }).catch((err) => {
        req.err.show("服务出小差了");
      }); 
  }

})