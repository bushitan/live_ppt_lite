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
// messages = [
//   {
//     type: "speak",
//       content: 'grfeig',
//         user: {
//       nickName: "是否会",
//         avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/AaibHVFics45MCcosG6N24D9P20ygnqibwia3awXdjKbhVG6uqgPUgPse8FRYeVE9w2nkI6xsrgHrgBzO3o9GUWaww/0'
//     },
//   },
// ]
// feedback:{
//     type:Array,
//     value: [ ],
//     observer:"_addMessage",
// },
// pusher: {
//     type: Boolean,
//     value: false,
// },
Component({
  /**
   * 组件的属性列表
   */
    properties: {
        height:{
            type:String,
            value: "100vh",
        },
        message: {
            type: Array,
            value: [],
            observer:"addMessage",
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
    lastMessageId:"", //scroll滚动到的id位置

    isAudioMode:false,
    audioIconStatus:0, //0 未开始， 1 录制 2 取消

    MESSAGE_TEXT : 0,
    MESSAGE_IMAGE : 1,
    MESSAGE_AUDIO : 2,
    YES:1,
    NO:0,
    showBoard:true,
  },

  // 组件加载完毕
  ready:function(){
      this.openScroll()
      // this.toBottom()
  },
  /**
  * 组件的方法列表
  */
  methods: {
    clickBoard(){
        this.setData({
            showBoard: !this.data.showBoard
        })
    },

    /**
     * 语音发送
     */
    //设置语音模式
    setAudioMode(){
      this.setData({
        isAudio: !this.data.isAudio
      })
    },
    //语音触摸
    audioStart(e){
      console.log(e)
      this.startX = e.changedTouches[0].x
      this.startY = e.changedTouches[0].y
      this.setData({audioIconStatus: 1,}) //录制
      //开始录制
    },
    audioMove: function (e) {
      var moveY = e.changedTouches[0].y
      if (this.startY - moveY > 50)
        this.setData({isAudioComfirm:2,}) //取消 
    },
    audioEnd: function (e) {
      this.setData({ isAudioComfirm: 0, }) //隐藏
      var moveY = e.changedTouches[0].y
      if (this.startY - moveY > 50)
        return
      //录制成功
    },

    /**
     * 信息撤销
     * */



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
        // if (this.data.isScroll == true)
        //     this.toBottom()
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
        // if (this.data.inputValue == ""){
        //     wx.showToast({
        //         title: '请输入内容',
        //         icon:"loading",
        //         duration:500,
        //     })
        //     return
        // }
        // this.toBottom()
        this.triggerEvent('send', this.data.inputValue );  
        this.setData({
            inputValue: ""
        })
        // this.toBottom()
    },

    // 滚动哦到底部
    toBottom(){
      var that = this
      var query = wx.createSelectorQuery().in(this)
      query.select('#scroll').boundingClientRect(function (res) {
          console.log(res)
          // console.log(res)
          // res.top // 这个组件内 #the-id 节点的上边界坐标
        //   that.setData({
        //       scrollTop: 1000000
        //       // scrollTop: res.bottom
        //   })
          that.setData({
              toview: 'scroll-bottom'
          });
      }).exec()
    },

    addMessage(){
      console.log(this.data.message)
      if (this.data.isScroll == true){
          // this.toBottom()
        var message = this.data.message;
        var lastMessageId = message.length ? message[message.length - 1].id : 'none';
        this.setData({ lastMessageId });
      }
    },
    // sendMessage(e) {
    //   var word = '是滴哦撒娇都是'
    //   var who = 'tan'
    //   this.pushMessage(this.createUserMessage(word, who, false));
    //   return
    // },
    // msgUuid() {
    //   if(!this.next) this.next = 0
    //   return 'msg-' + (++this.next);
    // },
    // createUserMessage(content, user, isMe) {
    //   return { id: this.msgUuid(), type: 'speak', content, user, isMe };
    // },
    // pushMessage(message) {
    //   this.updateMessages(messages => messages.push(message));
    // },
    // updateMessages(updater) {
    //   var messages = this.data.messages;
    //   updater(messages);
    //   this.setData({ messages });
    //   // 需要先更新 messagess 数据后再设置滚动位置，否则不能生效
    //   var lastMessageId = messages.length ? messages[messages.length - 1].id : 'none';
    //   this.setData({ lastMessageId });
    // },
  },
})

