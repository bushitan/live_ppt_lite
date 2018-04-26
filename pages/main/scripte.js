
var KEY = require('../../utils/key.js');

var teacher = "live_app_3"
var student = 'live_pvp_user_5'


module.exports = new (function() {
    var that = this
    var APP = null
    var GP = null
    var API = null
    var JMessage = null
    this.Init = function (_APP, _GP, _API, _JMessage){
        APP = _APP
        GP = _GP
        API = _API
        JMessage = _JMessage
    }

    //获取故事列表
    this.RequestStoryList = function(){
        API.Request({
            url: API.PVP_STORY_GET_LIST,
            success: function (res) {
                console.log(res.data)
                GP.setData({
                    storyList: res.data.stage_list,
                    // config: res.data.stage_list[0],
                    // config: storyList[0].list[0].config,
                    // storyList: storyList,
                })
                that.jmInit() //IM登陆  
            },
        })
    }

    /**
     * IM监听
     */
    this.jmInit = function () {
        var user_info = wx.getStorageSync(KEY.USER_INFO)
        var userName = "live_pvp_user_" + user_info.user_id
        console.log(userName)
        // var userName = "live_app_3"
        var passWord = "123"
        JMessage.init(APP, userName, passWord, this.listen);
    }

    //监听事件
    this.listen = function(){

        if(GP.data.isTeacher == false){
            var s_say = { text: "on" }
            that.sendSingleCustom(teacher, s_say) //学生打招呼
        }
        //监听单聊信息
        JMessage.JIM.onMsgReceive(function (data) {
            // var msg = data;
            // var body = data.messages[0].content.msg_body;
            // data = JSON.stringify(data);
            // console.log('msg_receive:' + data);
            // console.log(data)
            var body = data.messages[0].content.msg_body
            var text = body.text
            if (text == "on"){
                wx.showModal({
                    title: '学生上线',
                })
                var t_call = {
                    text: "stage",
                    stage:GP.data.stage
                }
                that.sendSingleCustom(student, t_call)
            }
                // console.log('学生上线')
            // else {
            if (text == "stage"){
                var custom = body.stage
                console.log(custom)
                wx.showToast({
                    title: '更换主题',
                    icon:"success",
                })
                GP.setData({
                    stage: custom
                })
            }

        });
    },

    this.sendSingleCustom = function (username, custom) {
        JMessage.JIM.sendSingleCustom({
            'target_username': username,
            'custom': custom,
            'need_receipt': true
        }).onSuccess(function (data) {
            console.log(data)
            // var re = that.data.logInfo + 'success:' + JSON.stringify(data);
            
        }).onFail(function (data) {
            var re = that.data.logInfo + 'fail:' + JSON.stringify(data);
            that.setData({
                logInfo: re
            });
        });
    }










    //获取故事列表
    this.RequestRoomCreate = function () {
        API.Request({
            url: API.PVP_ROOM_CREATE,
            success: function (res) {
                // console.log(res.data)
                GP.setData({
                    roomKey: res.data.room_key, //房间秘钥
                    roomConfig: res.data.room_config, //房间推流、拉流配置
                })

                // that.RequestRoomJoin(res.data.room_key)
                // that.RequestRoomJoin(res.data.room_key)
                //TODO 进入房间，房主身份
            },
        })
    }

    //获取故事列表
    this.RequestRoomJoin = function (room_key) {
        API.Request({
            url: API.PVP_ROOM_JOIN,
            data:{
                room_key: room_key,
            },
            success: function (res) {
                // console.log(res.data)
                //TODO 成功，进入房间，学生身份
                if (res.data.is_alive == true){
                    GP.inStageStudent()
                    //给老师发送on

                    
                } else{
                    // wx.showModal({
                    //     title: '温馨提示',
                    //     content: '房间已经过期，您可以选择任意一个故事，重新邀请好友',
                    // })
                }

                

            },
        })
    }



    /**
     * 页面显示控制
     */
    function baseShow(){
        return {
            stage: false, //直播舞台
            menu: false, //工具
            theme: false,//更换主题
            story: false, //故事菜单
            member: false,  //会员支付
        }
    }
    // 打开选故事页面
    this.ShowStory = function () {
        var _show = baseShow()
        _show.story = true
        GP.setData({ show: _show })
    }
    // 打开会员页面
    this.ShowMember = function () {
        var _show = baseShow()
        _show.member = true
        GP.setData({ show: _show })
    }

    // 打开舞台
    this.ShowStage = function () {
        var _show = baseShow()
        _show.stage = true
        _show.menu = true
        GP.setData({ show: _show })
    }

    //菜单切换
    this.MenuSwitch = function () {
        var _show = GP.data.show
        _show.menu = !_show.menu
        GP.setData({ show: _show })
    }

    //显示主题
    this.ShowTheme = function () {
        var _show = baseShow()
        _show.theme = true
        _show.stage = true
        GP.setData({ show: _show })
    }
    //关闭主题
    this.CloseTheme = function () {
        var _show = baseShow()
        _show.stage = true
        _show.menu = true
        console.log(_show)
        GP.setData({ show: _show })
    }
    
})