// compenonts/xx_im/xx_im.js
// feedback: [
//     {
//         content: '你可以留下联系方式，文本，图片，进行反馈',
//         content_type: 0,
//         contract_info: '',//弹出框input值
//         myDate: '2018-01-05 12:45',
//         role: false,
//         img: '../../images/hotapp_01_03.png',
//     }, 
// ]


Component({
  /**
   * 组件的属性列表
   */
  properties: {
        feedback:{
            type:Array,
            value: [ ],
            observer:"_addMessage",
        },
        height:{
            type:String,
            value: "100vh",
        },
        pusher: {
            type: Boolean,
            value: false,
        },
        messages: {
          type: Array,
          value: [
            {
              type: "speak",
              content: 'grfeig',
              user: {
                nickName: "是否会",
                avatar: 'https://wx.qlogo.cn/mmopen/vi_32/AaibHVFics45MCcosG6N24D9P20ygnqibwia3awXdjKbhVG6uqgPUgPse8FRYeVE9w2nkI6xsrgHrgBzO3o9GUWaww/0'
              },
            },
          ],
        },
  },

    /**
     * 组件的初始数据
     */
    data: {
        rigthArrow: "../../images/hotapp_triangleRight.png",
        leftArrow: "../../images/hotapp_triangleLeft.png",
        inputValue:"",
        scrollTop:0,
        isScroll:false,
    },

    // 组件加载完毕
    ready:function(){
        this.openScroll()
        this.toBottom()
    },
    /**
    * 组件的方法列表
    */
    methods: {
        //   点击预览图片
        clicImage(e){
            console.log(e.currentTarget.dataset.image_url)
            wx.previewImage({
                urls: [e.currentTarget.dataset.image_url],
            })
        },
        // 输入信息
        inputValue(e){
            // console.log()
            this.setData({
                inputValue: e.detail.value
            })
        },

        //增加新信息，滑动到底部
        _addMessage() {
            if (this.data.isScroll == true)
                this.toBottom()
        },
        closeScroll() {
            console.log("closeScroll")
            this.setData({ isScroll: false })
        },
        openScroll(){
            console.log("openScorll")
            this.setData({ isScroll:true})
        },
        // 发送信息
        send(){
            if (this.data.inputValue == ""){
                wx.showToast({
                    title: '请输入内容',
                    icon:"loading",
                    duration:500,
                })
                return
            }
            this.triggerEvent('send', this.data.inputValue );  
            this.setData({
                inputValue: ""
            })
            this.toBottom()
        },

        // 滚动哦到底部
        toBottom(){
            var that = this
            var query = wx.createSelectorQuery().in(this)
            query.select('#scroll').boundingClientRect(function (res) {
                console.log(res)
                // console.log(res)
                // res.top // 这个组件内 #the-id 节点的上边界坐标
                that.setData({
                    scrollTop: 1000000
                    // scrollTop: res.bottom
                })
            }).exec()
        },
    },
})
