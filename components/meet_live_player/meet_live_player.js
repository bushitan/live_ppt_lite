
Component({
  /**
   * 组件的属性列表
   */
    properties: {
        src:{
            type: String,
            value: "rtmp://live.12xiong.top/AppName/StreamName",
        },
        messages: {
            type: Array,
            value: [],
            // observer: '_changeMessage',
        },
        width: {
            type: String,
            value: "100%",
        },
        height: {
            type: String,
            // value: "100vh",
            value: "400rpx",
        },
  },

  /**
   * 组件的初始数据
   */
    data: {
        player:{},
        isFullScreen:false,
        isShowMessage:true,
        isShowMenu:true,
        isPlay:true,
        isVoice:true,
    },

    ready() {
        // var player = 
        this.setData({
            player: wx.createLivePlayerContext("player", this)
        })
        // console.log(this.data.player)
        this.hiddenMenu() //5秒后自动隐藏
    },
  /**
   * 组件的方法列表
   */
    methods: {
        play() {
            var that = this
            console.log("开始")
            this.data.player.play({
                success:function(){
                    console.log("开始成功")
                    that.setData({ isPlay: true})
                }
            })
        },
        stop() {
            var that = this
            this.data.player.stop({
                success: function () {
                    console.log("结束")
                    that.setData({ isPlay: false })
                }
            })
        },

        closeVoice() {
            var that = this
            this.data.player.mute({
                success: function () {
                    console.log("静音")
                    that.setData({ isVoice: false })
                }
            })
        },
        openVoice() {
            var that = this
            this.data.player.mute({
                success: function () {
                    console.log("打开声音")
                    that.setData({ isVoice: true })
                }
            })
        },
        
        showMenu(){
            if (this.data.isShowMenu == true)
                return
            else{
                this.setData({ isShowMenu:true})
                this.hiddenMenu() //5秒后自动隐藏
            }
        },
        hiddenMenu(){
            var that = this
            setTimeout(function () {
                that.setData({ isShowMenu: false })
            }, 5000)
        },


        // 弹幕开关
        switchMessage(){
            this.setData({
                isMessage: !this.data.isMessage
            })
        },

        // 进入全屏
        liveFullScreen() {
            console.log("进入全屏")
            var that = this
            this.data.player.requestFullScreen({
                direction:0,
                success: function (res) {
                    that.setData({
                        isFullScreen:true
                    })
                },
                fail: function (res) {
                    console.log(res)
                },
            })
        },
        // 退出全屏
        exitFullScreen() {
            console.log("退出全屏")
            var that = this
            this.data.player.exitFullScreen({
                success: function (res) {

                    that.setData({
                        isFullScreen: false
                    })
                },
                fail: function (res) {
                    console.log(res)
                },
            })
        },

        
          // 进入全屏
        reverse() {
            console.log("进入横屏")
                var that = this
                this.data.player.requestFullScreen({
                direction: 90,
                success: function (res) {
                    that.setData({
                        isFullScreen: true
                    })
                },
                fail: function (res) {
                    console.log(res)
                },
            })
        },



        //   click(e) {     
        //       this.triggerEvent('click', e.currentTarget.dataset.index);
        //   },
        input(e) {
            // console.log(e)
            this.triggerEvent('input', e.detail.value);
        },        
        change(e){
            console.log(e)
            this.setData({
                index: e.detail.value
            })
            this.triggerEvent('change', e.detail.value);
        }
    }
})
