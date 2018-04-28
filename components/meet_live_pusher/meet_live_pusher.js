// components/xx_cover_news/xx_cover_news.js
var GP
Component({
  /**
   * 组件的属性列表
   */
    properties: {
        title: {
            type: String,
            value: "标记",
        },
        width: {
            type: String,
            value: "100%",
        },
        height: {
            type: String,
            value: "400rpx",
        },
        mode: {
            type: String,
            value: "RTC",
        },
        menu: {
            type: Boolean,
            value: true,
        },

  },

  /**
   * 组件的初始数据
   */
  ready() {
    this.setData({
      pusher: wx.createLivePusherContext("pusher", this)
    })
    GP = this
  },

  data: {
    statusPlay: "播放",

    statusOrientation:"水平",
    orientation:"vertical",

    statusMode: "实时通话",

    aspect: "9:16"
    // mode: "RTC",
  },

  /**
   * 组件的方法列表
   */
  methods: {
      // 改变
    _change(newVal, oldVal) {
    },
    // 切换摄像头
    switchCamera(){
      GP.data.pusher.switchCamera() 
    },
    // 播出状态
    switchPlay(){
      console.log(213)
      var statusList = ["播放", "停止", "暂停", "恢复"]
      wx.showActionSheet({
        itemList: statusList,
        success(res) {
          if (res.tapIndex == 0) GP.data.pusher.start()
          if (res.tapIndex == 1) GP.data.pusher.stop()
          if (res.tapIndex == 2) GP.data.pusher.pause()
          if (res.tapIndex == 3) GP.data.pusher.resume() 
          GP.setData({
            statusPlay: statusList[res.tapIndex ]
          })
        }
      })
    },
    //3 屏幕录制方向
    switchOrientation() {
      wx.showActionSheet({
        itemList: ["水平","垂直"],
        success(res) {
          if (res.tapIndex == 0) GP.setData({statusOrientation: "水平",orientation: "vertical",})
          if (res.tapIndex == 1) GP.setData({statusOrientation: "竖直",orientation: "horizontal",})
        }
      })
    },
    //4 SD（标清）, HD（高清）, FHD（超清）, RTC（实时通话）
    switchMode(e) {
      wx.showActionSheet({
        itemList: ["实时通话", "标清", "高清", "超清"],
        success(res) {
          if (res.tapIndex == 0) GP.setData({ statusMode: "实时通话", mode: "RTC", })
          if (res.tapIndex == 1) GP.setData({ statusMode: "标清", mode: "SD", })
          if (res.tapIndex == 2) GP.setData({ statusMode: "高清", mode: "HD", })
          if (res.tapIndex == 3) GP.setData({ statusMode: "超清", mode: "FHD", })
        }
      })
    },
    //5 宽高比
    switchAspect(e) {
      wx.showActionSheet({
        itemList: ["9:16", "3:4"],
        success(res) {
          if (res.tapIndex == 0) GP.setData({ aspect: "9:16" })
          if (res.tapIndex == 1) GP.setData({ aspect: "3:4" })
        }
      })
    },

    statechange(e) {
        console.log('live-pusher code:', e.detail.code)
    },
    statechangePlayer(e) {
        console.log('live-player code:', e.detail.code)
    },
    error(e) {
        console.error('live-player error:', e.detail.errMsg)
    },

  }
})
