Component({
	properties: {
		// 这里定义了innerText属性，属性值可以在组件使用时指定
		index: {
			type: Number,
			value: 0
		},
		show: {
			type: Boolean,
			value: false
		},
		myCar: {
			type: Array,
			default: []
		}
	},
	data: {
		// 这里是一些组件内部数据
		provinces: [],
		letters: [],
		currentDatas: [],
		carNo: ['', '', '', '', '', '', '', ''],
		myShow: false,
		wrapper: false
	},

	methods: {
		clickKeyboard(e) {
			let index = parseInt(e.currentTarget.dataset['index']);
			if (this.data.index === 1 && index <= 9) {
				return;
			}
			if (this.data.currentDatas[index] === '确定') {
				this.setData({
					wrapper: false
				});
				setTimeout(() => {
					this.setData({
						myShow: false
					});
					this.triggerEvent('valueChange', {
						carNo: this.data.carNo,
						index: this.data.index,
						show: this.data.myShow
					});
				}, 400);

				return;
			}
			if (this.data.currentDatas[index] === 'b') {
				console.log();
			} else if (this.data.currentDatas[index] === 'del') {
				let arr = this.data.carNo;
				arr[this.data.index] = '';
				this.setData({
					carNo: arr,
					index: --this.data.index
				});
				if (this.data.index === -1) {
					this.setData({
						index: 0
					});
				}
			} else {
				let arr = this.data.carNo;
				arr[this.data.index] = this.data.currentDatas[index];
				this.setData({
					carNo: arr,
					index: ++this.data.index
				});
			}
			this.triggerEvent('valueChange', {
				carNo: this.data.carNo,
				index: this.data.index,
				show: this.data.myShow
			});
			if (this.data.index === this.data.carNo.length) {
				this.setData({
					wrapper: false
				});
				this.triggerEvent('valueChange', {
					carNo: this.data.carNo,
					index: this.data.index,
					show: false
				});
			}

			wx.canIUse('vibrateShort') && wx.vibrateShort();
		},
		showMethod(isShow) {
			let arr = this.data.myCar;
			if (arr && arr.length !== 0) {
				if (arr.length === 7) {
					arr.push('');
				}
				this.setData({
					carNo: arr
				});
			}
			if (isShow) {
				this.setData({
					myShow: isShow,
					wrapper: true
				});
			} else {
				this.setData({
					wrapper: false
				});
				setTimeout(() => {
					this.setData({
						myShow: false
					});
				}, 400);
			}
		},
		indexMethod(currentIndex, OldIndex) {
			if (currentIndex === OldIndex) {
				return;
			}
			if (this.data.provinces.length === 0) {
				this.setData({
					provinces: '豫京津沪渝苏浙粤川陕冀辽吉皖闽鄂湘鲁晋黑赣贵甘桂琼云青蒙藏宁新'.split(''),
					letters: '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'.split('')
				});
			}
			let datas = [];
			for (let i = 0; i < 36; i++) {
				if (currentIndex === 0) {
					if (this.data.provinces[i] !== undefined) {
						datas.push(this.data.provinces[i]);
					} else {
						datas.push('');
					}
				} else {
					if (this.data.letters[i] !== undefined) {
						datas.push(this.data.letters[i]);
					} else {
						datas.push('');
					}
				}
			}
			datas.push('b');
			datas.push('del');
			datas.push('确定');
			this.setData({
				currentDatas: datas
			});
		}
	},
	lifetimes: {
		attached() {
		}
	},
	observers: {
		show: function (isShow) {
			this.showMethod(isShow);
		},
		index: function (currentIndex, OldIndex) {
			this.indexMethod(currentIndex, OldIndex);
		}
	}
});
