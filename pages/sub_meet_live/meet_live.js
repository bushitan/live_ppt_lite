// pages/mode/mode.js
var APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');
var LIB = require('lib.js');
var Script = require('script.js');
// var IM = require('../../utils/im/im.js')

var JMessage = require('../../utils/im/jm.js')


// var jim 
var GP
var message
var MSG_TYPE_PPT = "xx_ppt"
var MSG_TYPE_DRAW = "xx_draw"
var MSG_TYPE_CLEAR = "xx_clear"

var LIVE_MODE_TEXT = 'text'
var LIVE_MODE_VIDEO = 'video'
// console.log(LIB.room)
Page({
    data: {
        imRoomID: 12500045, //房间编号
        liveMode: LIVE_MODE_TEXT,//直播模式
        //房间的类型
        orientation: "vertical",
        // isBegin: false,
        // room: LIB.room,
        isTeacher: false,//是否推流权限
        messageList:[], //IM信息

        pusherTab: ["推流", "视频设置",],
        index : 0,
    },
    clickTab(e){
        var index = e.detail
        GP.setData({index:index})
    },
    onLoad(){},
    onShow() {
        // console.log('onshow')
        GP = this
        APP.globalData.currentPage = this
        GP.getCurrentRoom()
        GP.setData({
            userInfo : wx.getStorageSync(KEY.USER_INFO)
        })
        Script.init(GP)

    },

    //获取当前房间参数
    getCurrentRoom() {
        // console.log('in api get room')
        API.Request({
            url: API.ROOM_GET,
            success: function (res) {
                // console.log(res.data)
                GP.setData({
                    imRoomID: res.data.app_dict.im_num,
                    appDict: res.data.app_dict,

                    room: res.data.room_dict,
                    messageList: res.data.message_list,
                    isTeacher: res.data.is_teacher,
                })
                GP.jmInit() //IM登陆  
            },
        })
    },
    jmInit(){
        if (APP.globalData.JMessage == null)
            GP.onInitIMStudent()
        else
            JMessage = APP.globalData.JMessage
    },



    onInitIMStudent() {
        //已经登陆以后，就不用再登陆了
        
        var user_info = wx.getStorageSync(KEY.USER_INFO)
        var studentName = APP.globalData.baseAccount + user_info.user_id
        var passWord = APP.globalData.passWord
        //浜村账号密码
        GP.setData({
            studentName: studentName,
            passWord: passWord,
        })
        APP.initIM(studentName, passWord)
    },
        //登陆成功，加入房间
    IMSuccess() {

        // 进入聊天室
        JMessage.JIM.enterChatroom({
            'id': GP.data.imRoomID
        }).onSuccess(function (data) {
            // console.log("进入成功", data)
        }).onFail(function (data) {
            // console.log("进入失败", data)
        });
        // !! 聊天室信息监控
        JMessage.JIM.onRoomMsg(function (data) {
            // console.log(data)
            // APP.globalData.onRoomMessage(data)
            Script.listenMessage(
                data.content.msg_body.extras.nickname,
                data.content.msg_body.extras.avatar_url,
                data.content.msg_body.extras.is_teacher,
                KEY.MESSAGE_TEXT,
                data.content.msg_body.text,
            )
        });
    },




  //点击发送按钮事件
  sendMsg(e) {
    // console.log(e)
    //给自己发送信息
    Script.listenMessage(
      GP.data.userInfo.nick_name,
      GP.data.userInfo.avatar_url,
      GP.data.isTeacher,
      KEY.MESSAGE_TEXT,
      e.detail,
    )
    //像群里发送信息
    GP.sendRoomMsg(e.detail)

    //TODO 像后台发送信息记录
    API.Request({
      url: API.ROOM_ADD_MESSAGE,
      data: {
        "room_id": GP.data.room.room_id,
        "style": KEY.MESSAGE_TEXT,
        "is_teacher": GP.data.isTeacher? KEY.YES : KEY.NO,
        "content": e.detail,
      },
      success: function (res) {
        // console.log("存储消息成功")
      },
    })
  },


  sendRoomMsg(content, extras = {}) {

      extras['nickname'] = GP.data.userInfo.nick_name
      extras['gender'] = GP.data.userInfo.gender
      extras['avatar_url'] = GP.data.userInfo.avatar_url
      extras['is_teacher'] = GP.data.isTeacher


      JMessage.JIM.sendChatroomMsg({  //发送至群聊
          'target_rid': GP.data.imRoomID,
          // 'content': content,
          'content': content,
          'extras': extras
      }).onSuccess(function (data, msg) {
        //   console.log(data)
      }).onFail(function (data) {
        //   console.log(data)
      });
  },


  onShareAppMessage() { },
})

