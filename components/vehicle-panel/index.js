Component({

  externalClasses: ['v-panel'],

  properties: {
    isShow: {
      type: Boolean,
      value: false,
    },
    buttonBorder: {
      type: String,
      value: "1px solid #ccc"
    },
    backgroundColor: {
      type: String,
      value: "#fff"
    },
    //1为省份键盘，2为英文键盘，3为数字键盘
    keyBoardType: {
      type: Number,
      value: 1,
    },
    iskeyNumberClick:{
      type:Number,
      value: !0,
    },
    wrapper:{
      type: Boolean,
      value: false,
    }
  },
  data: {
    keyVehicle1: '豫陕京津沪冀云辽',
    keyVehicle2: '黑湘皖鲁新苏浙赣',
    keyVehicle3: '鄂桂甘晋蒙吉闽贵',
    keyVehicle4: '粤川青藏琼宁渝',
    keyNumber: '1234567890',
    keyEnInput1: 'QWERTYUIOP',
    keyEnInput2: 'ASDFGHJKL',
    keyEnInput3: 'ZXCVBNM',
    keyNumber1:'123',
    keyNumber2:'456',
    keyNumber3:'789',
    keyNumber4:'0',
  },
  methods: {
    vehicleTap: function (event) {
      let val = event.target.dataset.value;
      switch (val) {
        case 'delete':
          this.triggerEvent('delete');
          this.triggerEvent('inputchange');
          break;
        case 'ok':
          this.triggerEvent('ok');
          break;
        default:
          this.triggerEvent('inputchange', val);
      }
    },
  }
});