function install(req, request,uploadFile) {
  req.user = {
     //微信登录
     code2Session(data){
       const url = `${req.apiUrl}/smallprogram/code2Session`;
       return request({ url, method: 'GET', data })
     },
     //绑定手机号
    bindMobilePhone(data){
      const url = `${req.apiUrl}/smallprogram/bindMobilePhone`;
       return request({ url, method: 'POST', data })
     },
     //修改手机号
    changeMobile(data){
      const url = `${req.apiUrl}/smallprogram/changeMobile`;
      return request({ url, method: 'POST', data })
    },
     //手机号解绑
    unBindMobillePhone(data) {
      const url = `${req.apiUrl}/smallprogram/unbindMobillePhone`;
      return request({ url, method: 'POST', data })
    },
    //获取banner图
    getBannerList() {
      const url = `${req.apiUrl}/smallprogram/getBannerList`;
      return request({ url, method: 'GET' })
    },
    //获取签到信息
    getSignInfo(){
      const url = `${req.apiUrl}/smallprogram/getSignInfo`;
      return request({ url, method: 'POST' })
    },
    //签到
    getFractionBySign(){
      const url = `${req.apiUrl}/smallprogram/getFractionBySign`;
      return request({ url, method: 'POST' })
    },
    //创建订单（含支付）
    createAndPay(data){
      const url = `${req.apiUrl}/smallprogram/createandpay`;
      return request({ url, method: 'POST',data })
    },
    pay(data){
      const url = `${req.apiUrl}/smallprogram/unifiedorder`;
      return request({ url, method: 'POST', data })
    },
    //证件照识别接口
    uploadocr(data){
      const url = `${req.apiUrl}/smallprogram/uploadocr`;
      return uploadFile(Object.assign({url},data))
    },
    //提交办理资料
    submitOrderInfo(data){
      const url = `${req.apiUrl}/smallprogram/submitOrderInfo`;
      return request({ url, method: 'POST' ,data})
    },
    //业务办理详情查询 getOrderDetailsByPartner
    getOrderDetails(data){
      const url = `${req.apiUrl}/smallprogram/getOrderDetails`;
      return request({ url, method: 'GET', data })
    },
    //基本信息展示
    getUserInfo(){
      const url = `${req.apiUrl}/smallprogram/userinfo`;
      return request({ url, method: 'POST' })
    },
    //获取我的ETC列表
    getEtcInfo(data){
      const url = `${req.apiUrl}/smallprogram/getEtcInfo`;
      return request({
        url, method: 'GET',data})
    },
    //获取ETC卡通行记录
    getCurrentRecord(data){
      const url = `${req.apiUrl}/smallprogram/getCurrentRecord`;
      return request({ url, method: 'GET', data })
    },
    //获取优惠券列表
    couponList(){
      const url = `${req.apiUrl}/smallprogram/couponList`;
      return request({ url, method: 'GET' })
    },
    //优惠券领取
    couponReceive(data){
      const url = `${req.apiUrl}/smallprogram/couponReceive`;
      return request({ url, method: 'GET', data })
    },
    //我的优惠券列表
    myCouponList(data){
      const url = `${req.apiUrl}/smallprogram/myCouponList`;
      return request({ url, method: 'GET', data })
    },
    //加入ETC俱乐部
    joinClub(data){
      const url = `${req.apiUrl}/smallprogram/joinClub`;
      return request({ url, method: 'POST', data })
    },
    //我的ETC俱乐部
    myClub(data){
      const url = `${req.apiUrl}/smallprogram/myClub`;
      return request({ url, method: 'GET', data })
    },
    //退出ETC俱乐部
    exitClub(data) {
      const url = `${req.apiUrl}/smallprogram/exitClub`;
      return request({ url, method: 'POST', data })
    },
    //会员升级
    memberUpgrade(data){
      const url = `${req.apiUrl}/smallprogram/memberUpgrade`;
      return request({ url, method: 'POST', data})
    },
    //我的推广记录
    myExtensionRecord(data){
      const url = `${req.apiUrl}/smallprogram/myExtensionRecord`;
      return request({ url, method: 'GET', data })
    },
    //获取小程序码
    getQRcodeForClub(data){
      const url = `${req.apiUrl}/smallprogram/getQRcodeForClub`;
      return request({ url, method: 'POST', data })
    },
    getHDQRcodeForClub(data){
      const url = `${req.apiUrl}/smallprogram/getHDQRcodeForClub`;
      return request({ url, method: 'POST', data })
    },
    //活动创建订单
    createAndPayHD(data) {
      const url = `${req.apiUrl}/smallprogram/createandpayhd`;
      return request({ url, method: 'POST', data })
    },
    
  };
  req.common = {
    //获取验证码
    sendVCode(data){
      const url = `${req.apiUrl}/common/sendvcode`;
      return request({ url, method: 'GET', data});
    }
  };
}

module.exports = {
  install,
};
