
var KEY = require('../../utils/key.js');
module.exports = new (function () {
    var that = this
    var APP = null
    var GP = null
    var API = null
    var JMessage = null
    this.Init = function (_APP, _GP, _API, _JMessage) {
        APP = _APP
        GP = _GP
        API = _API
        JMessage = _JMessage
    }
    this.roomAdd = function () { 
        API.Request({
            url: API.PPT_ROOM_ADD,
            success: function (res) {
                GP.setData({
                    liveConfig: res.data.config_dict,
                })
            },
        })        
    }
    this.roomDelete = function () { 
        API.Request({
            url: API.PPT_ROOM_DELETE,
            success: function (res) {
                wx.redirectTo({
                    url: '/pages/main/main',
                })
            }
        })     
    }
    this.roomCheck = function (host_name) { 
        API.Request({
            url: API.PPT_ROOM_CHECK,
            data: {
                host_name: host_name
            },
            success: function (res) {
                console.log(res)
                console.log(res.data.check_dict)
                if (res.data.check_dict == false){
                    //房间不存在
                    wx.showModal({
                        title: '温馨提示',
                        content: '房间已经过期，您可以选择任意一个故事，重新邀请好友',
                        success: function () {
                            wx.redirectTo({
                                url: '/pages/main/main',
                            })
                        },
                    })
                }
                else{
                    //房间存在
                    wx.showToast({
                        title: 'online成功',
                    })
                    wx.hideLoading()
                    GP.setData({
                        otherName: GP.data.teacherName,
                        isConnect: true,
                        liveConfig: res.data.check_dict
                    })
                }

            },
        })
    }
     




    /**1 初始化 */
    // 1.1 老师初始化
    this.initTeacherIM = function () {
        utilInit(GP.isTeacherSuccess)
    }
    // 1.2 学生初始化
    this.initStudentIM = function () {
        utilInit(GP.isStudentSuccess)
    }
    function utilInit( callback){
        var user_info = wx.getStorageSync(KEY.USER_INFO)
        var selfName = "live_ppt_user_" + user_info.user_id
        console.log(selfName)
        var passWord = "123"
        GP.setData({
            selfName: selfName,
            passWord: passWord,
        })
        JMessage.init("", selfName, passWord, callback );
    }

    /**
     * 2 发送信息
     */
    // 2.1 老师发送
    //发送老师上线通知
    function sendTeacherOnline() {
        sendOtherMessage({ text: "teacher_online", liveConfig: GP.data.liveConfig })
    }

    // 2.2 学生发送
    // 发送学生验证请求
    this.sendStudentCheck = function (body) {
        //发出验证token的请求
        var s_say = {
            text: "student_check",  //验证
            student_name: GP.data.selfName, //学生名字
            token: GP.data.token,//验证token
        }
        console.log(GP.data.selfName, GP.data.token)
        // JMessage.sendSingleCustom(GP.data.teacherName, s_say) //学生打招呼

        sendOtherMessage(s_say)
    }

    //2.3 公共发送
    //发送绘画
    this.sendPPT = function (url) {
        sendOtherMessage({ text: "ppt", url: url })
    }
   
    //发送绘画
    this.sendDraw = function (path) {
        sendOtherMessage({ text: "draw", path: path })
    }
    //清除
    this.sendClear = function (path) {
        sendOtherMessage({ text: "clear", path: path })
    }
    //下线通知
    this.sendOtherOffline = function() {
        sendOtherMessage({ text: "off", })
    }
    // 向对方发送信息
    function sendOtherMessage(t_call) {
        console.log("send other",GP.data.otherName)
        if (GP.data.otherName)
            JMessage.sendSingleCustom(GP.data.otherName, t_call)
    }

    /**
     * 3 接收消息
     */
    // 3.1 教师接收事件
    this.teacherReceive = function (data) {
        var body = data.messages[0].content.msg_body

        if (body.text == "student_check") { //接收学生的上线信息
            // console.log(APP.globalData.liveConfig)
            // GP.setData({ liveConfig: APP.globalData.liveConfig }) //学生上线后，再设置推流地址
            console.log("token",data)
            getCheck(body.student_name, body.token)
        }
        
    }
    // 3.2 学生接收事件
    this.studentReceive = function (data) {
        //监听单聊信息
        var body = data.messages[0].content.msg_body

        var _push = GP.data.print
        _push.push(body.text)
        GP.setData({ print: _push })

        if (body.text == "expire") {  //token过期
            expire()
        }

        if (body.text == "teacher_online") {  //连接成功
            online(body)
        }
        if (body.text == "time_out") {
            getTimeOut()
        }
    }
    // 3.3 公共接收
    this.utilReceive = function (data) {
        var body = data.messages[0].content.msg_body

        if (data.messages[0].content.msg_type == "image") { //视频截图
            getSnapshot(data.messages[0].content.msg_body.media_id)
        }

        if (body.text == "ppt") { //切换场景
            getPPT(body.url)
        }
        if (body.text == "draw") { //绘画完成
            getDraw(body.path)
        }
        if (body.text == "clear") { //清除屏幕
            getClear(body.path)
        }
        if (body.text == "off") { //接收学生的下信息
            getStudentOffline()
        }
    }

    /**
     * 4、接收事件
     */
    // 4.1 老师接收事件
    function getCheck(student_name, token){
        GP.setData({
            otherName: student_name,
            studentName: student_name,
            token: null, //token过期，别 的就不能进了
            isOnline: true,
            isStart: true,
            isConnect: true,
            // liveConfig: liveConfig,
        })
        sendTeacherOnline()



        // //失败，返回 expire
        // if ( GP.data.token == undefined){
        //     var s_say = { 
        //         text: "expire", 
        //         student_name: student_name
        //     } 
        //     JMessage.sendSingleCustom(student_name, s_say) //学生打招呼
        //     return
        // }

        // if (GP.data.token == token) {
        //     GP.setData({
        //         otherName: student_name,
        //         studentName: student_name,
        //         token:null, //token过期，别 的就不能进了
        //         isOnline:true,
        //         isStart: true,
        //         isConnect: true,
        //         // liveConfig: liveConfig,
        //     })
        //     sendTeacherOnline()
        //     // this.sendStage()
        // }
        // else{ //分享过期
        //     var s_say = {
        //         text: "expire",
        //         student_name: student_name
        //     }
        //     JMessage.sendSingleCustom(student_name, s_say) //学生打招呼
        //     return
        // }

    }

    //接收下线
    function getStudentOffline(){
        wx.showModal({
            title: '对方下线',
            success: function () {
                // wx.navigateBack()
                wx.redirectTo({
                    url: '/pages/main/main',
                })
            },
        })
    }


    // 4.2 学生接收事件
    function expire(){
        wx.showModal({
            title: '温馨提示',
            content: '房间已经过期，您可以选择任意一个故事，重新邀请好友',
            success: function () {
                wx.redirectTo({
                    url: '/pages/main/main',
                })
            },
        })
    }
    function online(body){
        wx.showToast({
            title: 'online成功',
        })
        wx.hideLoading()
        GP.setData({
            otherName: GP.data.teacherName,
            isConnect: true,
            liveConfig: body.liveConfig
        })
    }
    function getTeacherOffline(){
        wx.showModal({
            title: '老师下线',
            success: function () {
                wx.redirectTo({
                    url: '/pages/main/main',
                })
            },
        })
    }
    function getTimeOut(){
        wx.showModal({
            title: '房主时间到，请重新连接',
            success() {
                var s_say = { text: "off", student_name: APP.globalData.student_name }
                JMessage.sendSingleCustom(APP.globalData.teacher_name, s_say) //学生打招呼
                wx.navigateTo({
                    url: '/pages/main/main',
                })
            },
        })
    }

    
    // 4.3 公共接收事件
    function getSnapshot(media_id){
        JMessage.JIM.getResource({
            'media_id': media_id,
        }).onSuccess(function (data) {
            // console.log(data, "image info")
            GP.setData({
                bgImageUrl: data.url,
            })
        }).onFail(function (data) {
            //data.code 返回码
            //data.message 描述
        });
    }

    function getPPT(url) {
        // wx.showToast({
        //     title: '更换PPT成功',
        //     icon: "success",
        // })
        GP.setData({
            bgImageUrl: url,
        })
    }
    function getDraw(path) {

        // wx.showToast({
        //     title: 'drwa成功',
        // })
        GP.setData({
            drawLine: path
        })
    }
    function getClear(path) {

        wx.showToast({
            title: '对方清除屏幕',
        })
        GP.setData({
            drawLine: path
        })
    }
})