
var GP 
var that
var APP
var KEY = require('../../utils/key.js');
// var IM = require('../../utils/im/im.js')
function Message(_GP) {
    that = this
    GP = _GP
    this.GP = _GP 
    this.APP = getApp()
    APP = getApp()
    console.log(this.APP)
    //更新自己的 列表
    this.sendSelf = function(e){
        console.log(e.detail)
        var value = e.detail
        var talk = {
            content: value,
            content_type: 0,
            contract_info: '',
            myDate: '',
            role: true,
            img: "../../images/hotapp_01_07.png"
        }
        var list = this.GP.data.feedback
        list.push(talk)
        this.GP.setData({
            feedback: list
        })
    }
    //IM发送
    this.sendOther = function (e) {
        // console.log(drawJson)
        var APP = this.APP
        if (APP.globalData.jimIsLogin) {
            APP.globalData.jim.sendChatroomMsg({
                'target_rid': APP.globalData.jimRoomID,
                'content': e.detail
            }).onSuccess(function (data, msg) {
                console.log(data)
                }).onFail(function (data) {
                console.log(data)
            });
        }
    },

    //IM发送 ——绘画数据
    this.sendDraw = function (drawObj) {
        // console.log(drawJson)
        var APP = this.APP
        if (APP.globalData.jimIsLogin) {
            APP.globalData.jim.sendChatroomMsg({
                'target_rid': APP.globalData.jimRoomID,
                'content': "xx_draw",
                'extras': drawObj
            }).onSuccess(function (data, msg) {
                console.log(data)
            }).onFail(function (data) {
                console.log(data)
            });
        }
    },        
    //IM发送 —— 清空屏幕
    this.sendClear = function (clearObj) {
        // console.log(drawJson)
        var APP = this.APP
        if (APP.globalData.jimIsLogin) {
            APP.globalData.jim.sendChatroomMsg({
                'target_rid': APP.globalData.jimRoomID,
                'content': "xx_clear",
                'extras': clearObj
            }).onSuccess(function (data, msg) {
                console.log(data)
            }).onFail(function (data) {
                console.log(data)
            });
        }
    },
    //IM发送 —— 清空屏幕
    this.sendPPT = function (imageObj) {
        // console.log(drawJson)
        var APP = this.APP
        if (APP.globalData.jimIsLogin) {
            APP.globalData.jim.sendChatroomMsg({
                'target_rid': APP.globalData.jimRoomID,
                'content': "xx_ppt",
                'extras': imageObj
            }).onSuccess(function (data, msg) {
                console.log(data)
            }).onFail(function (data) {
                console.log(data)
            });
        }
    },
    
    //断线重新登录
    this.reLogin = function(){

      var user_info = wx.getStorageSync(KEY.USER_INFO)
      var userName = "live_app_" + user_info.user_id
      // var userName = "live_app_3"
      var passWord = "123"
      APP.globalData.jim = new IM.Jim(GP, userName, passWord, that.success)
    }

    //IM 初始化成功
    this.success = function (data) {
        // var APP = that.APP
        // var GP = that.GP
        console.log('success')
        APP.globalData.jimIsLogin = true
        // 绑定监听
        APP.globalData.jim.onMsgReceive(function (data) {
            console.log("一般监听", data)
        });
      

        APP.globalData.jim.onDisconnect(function () {
          
          var task = setInterval(
            function(){
              if (APP.globalData.jim.isConnect()){
                clearInterval(task)
                wx.closeSocket()
                that.reLogin()
                console.log("重新登录")
              }
            },
            1000
          )
          
        });

        APP.globalData.jim.onRoomMsg(function (data) {
            console.log("聊天室监听", data)
            //画布
            if (data.content.msg_body.text == "xx_draw") {
                GP.setData({
                    drawLine: data.content.msg_body.extras
                })
            }
            else if (data.content.msg_body.text == "xx_clear") {
              GP.setData({
                drawLine: data.content.msg_body.extras
              })
            }
            else if (data.content.msg_body.text == "xx_ppt") {
              GP.setData({
                bgImageUrl: data.content.msg_body.extras.url
              })
            }
            else{
                // 文字传输
                var msg =
                    {
                        content: data.content.msg_body.text,
                        content_type: 0,
                        contract_info: '',//弹出框input值
                        myDate: '2018-01-05 12:45',
                        role: false,
                        img: '../../images/hotapp_01_03.png',
                    }
                var feedback = GP.data.feedback
                feedback.push(msg)
                GP.setData({
                    feedback: feedback
                })
            }
        });
        // 进入聊天室
        APP.globalData.jim.enterChatroom({
            'id': APP.globalData.jimRoomID
        }).onSuccess(function (data) {
            console.log("进入成功", data)
        }).onFail(function (data) {
            console.log("进入失败", data)
        });
    }

    // that.reLogin() 
}

function Mode(GP){
    this.GP = GP 
    this.itemList = ["推流", "推流参数设置", "直播", "视频校验", "封面"]

    this.ChangePlayer = function (index) {
        switch (index) {
            case 0: this.playerIM(); break;
            case 1: this.playerPainter(); break;
        }
    }
    this.playerIM = function () {
        this.GP.setData({
            showPlayerIM: true,
            showPlayerPainter: false,
        })
    }
    this.playerPainter = function () {
        this.GP.setData({
            showPlayerIM: false,
            showPlayerPainter: true,
        })
    }


    this.ChangePusher = function (index){
        switch (index) {
            case 0: this.pusher(); break;
            case 1: this.painter(); break;
            case 2: this.ppt(); break;
            case 3: this.set(); break;
            case 4: this.check(); break;
            case 5: this.cover(); break;
        }
    }
   
    this.pusher = function() {
        this.GP.setData({
            showPusher: true,
            showPusherMenu: false,
            showIM: true,
            showPainter:false,
            showPlayer: false,
            showCover: false,
            showGallery: false,
        })
    }
    this.painter = function() {
        this.GP.setData({
            showPusher: true,
            showPusherMenu: false,
            showIM: false,
            showPainter: true,
            showPlayer: false,
            showCover: false,
            showGallery: false,
        })
    }
    this.set = function() {
        this.GP.setData({
            showPusher: true,
            showPusherMenu: true,
            showIM: false,
            showPainter: false,
            showPlayer: false,
            showCover: false,
            showGallery: false,
        })
    }
    this.ppt = function () {
        this.GP.setData({
            showPusher: true,
            showPusherMenu: false,
            showIM: false,
            showPainter: false,
            showPlayer: false,
            showCover: false,
            showGallery: true,
        })
    }
    this.check = function() {
        this.GP.setData({
            showPusher: true,
            showPusherMenu: false,
            showIM: false,
            showPainter: false,
            showPlayer: true,
            showCover: false,
            showGallery: false,
        })
    }
    this.cover = function() {
        this.GP.setData({
            showPusher: false,
            showPusherMenu: false,
            showIM: false,
            showPainter: false,
            showPlayer: false,
            showCover: true,
            showGallery: false,
        })
    }
}

var room = {
    content_url: "https://img.qlchat.com/qlLive/followQRCode/topic-intro/4FO7HW8D-YOAB-98PQ-1520402709185-GSKH2RKY7UR2.jpg?x-oss-process=image/resize,w_800,limit_1",
    cover_url: "https://img.qlchat.com/qlLive/topicBackground/WXKEEQQT-AVDQ-LQE3-1520390119263-DUXDSUFVXX96.jpg?x-oss-process=image/resize,m_fill,limit_0,h_500,w_800",
    create_time: "2018-03-10",
    description: "时间：2018-03-08 19:30:00",
    im_num: "12510285",
    player_url: "rtmp://live.12xiong.top/AppName/StreamName",
    pusher_url: "rtmp://video-center.alivecdn.com/AppName/StreamName?vhost=live.12xiong.top",
    room_id: 1,
    serial: 0,
    style: 1,
}//直播房间

var feedback = [
    {
        content: '你可以留下联系方式，文本，图片，进行方式，文本，图片，进行反馈',
        content_type: 0,
        contract_info: '',//弹出框input值
        myDate: '2018-01-05 12:45',
        role: false,
        img: '../../images/hotapp_01_03.png',
    }, {
        content: '../../images/hotapp_01_03.png',
        content_type: 1,
        contract_info: '',
        myDate: '',
        role: true,
        img: "../../images/hotapp_01_07.png"
    },
    {
        content: '【系统消息】：您的反馈已',
        content_type: 0,
        contract_info: '',
        myDate: '',
        role: true,
        img: "../../images/hotapp_01_07.png"
    },
    {
        content: '【系统消息】：您的反馈已',
        content_type: 0,
        contract_info: '',
        myDate: '',
        role: true,
        img: "../../images/hotapp_01_07.png"
    },
    {
        content: '【系统消息】：您的反馈已',
        content_type: 0,
        contract_info: '',
        myDate: '',
        role: true,
        img: "../../images/hotapp_01_07.png"
    },
    {
        content: '【系统消息】：您的反馈已',
        content_type: 0,
        contract_info: '',
        myDate: '',
        role: true,
        img: "../../images/hotapp_01_07.png"
    },
]

module.exports = {
    Mode: Mode,
    Message: Message,
    feedback: feedback,
    room: room,
}