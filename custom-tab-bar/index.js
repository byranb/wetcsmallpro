Component({

  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/images/pic/home-off.png",
      selectedIconPath: "/images/pic/home-on.png"
    }, {
        pagePath: "/pages/coupons/index",
        iconPath: "/images/pic/order-off.png",
        selectedIconPath: "/images/pic/order-on.png"
    },
      {
        pagePath: "/pages/my/index",
        iconPath: "/images/pic/my-off.png",
        selectedIconPath: "/images/pic/my-on.png"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      console.log(data)
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})