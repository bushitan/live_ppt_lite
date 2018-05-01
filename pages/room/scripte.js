
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
 
    //验证用户是否有权限
    /**
     * arg: 
     *  student_name 同学账户
     *  toekn 验证码
     */
    this.getCheck = function (student_name, token){

        //失败，返回 expire
        if ( GP.data.token == undefined){
            var s_say = { 
                text: "expire", 
                student_name: student_name
            } 
            JMessage.sendSingleCustom(student_name, s_say) //学生打招呼
            return
        }

        if (GP.data.token == token) {
            GP.setData({
                studentName: student_name,
                token:null,
                isOnline:true,
                // liveConfig: liveConfig,
            })
            this.sendStudentOnline()
            // this.sendStage()
        }
        else{ //分享过期
            var s_say = {
                text: "expire",
                student_name: student_name
            }
            JMessage.sendSingleCustom(student_name, s_say) //学生打招呼
            return
        }

    }

    //发送绘画
    this.sendPPT = function (url) {
        var t_call = {
            text: "ppt",
            url: url
        }
        JMessage.sendSingleCustom(GP.data.studentName, t_call)
    }
    //发送绘画
    this.sendDraw = function (path) {
        var t_call = {
            text: "draw",
            path: path
        }
        JMessage.sendSingleCustom(GP.data.studentName, t_call)
    }
    //清除
    this.sendClear = function (path) {
        var t_call = {
            text: "clear",
            path: path
        }
        JMessage.sendSingleCustom(GP.data.studentName, t_call)
    }
    //学生上线
    this.sendStudentOnline = function () {
        var t_call = {
            text: "on",
            liveConfig: GP.data.liveConfig
        }
        JMessage.sendSingleCustom(GP.data.studentName, t_call)
    }
    //下线
    this.getStudentOffline = function(){
        wx.showModal({
            title: '学生下线',
            success: function () {
                wx.navigateBack()
            },
        })
    }


    //学生接收事件
    this.teacherReceive = function (data) {
        var body = data.messages[0].content.msg_body
        if (body.text == "check") { //接收学生的上线信息
            console.log(APP.globalData.liveConfig)
            GP.setData({ liveConfig: APP.globalData.liveConfig }) //学生上线后，再设置推流地址
            Scripte.getCheck(body.student_name, body.token)
        }

        // if (body.text == "on") { //接收学生的上线信息
        //     GP.getStudentOnline(body.student_name)
        // }

        if (body.text == "off") { //接收学生的下信息
            Scripte.getStudentOffline(body.student_name)
        }
    }



    //学生接收事件
    this.studentOnline = function (body) {
        //发出验证token的请求
        var s_say = {
            text: "check",  //验证
            student_name: GP.data.studentName, //学生名字
            token: GP.data.token,//验证token
        }
        JMessage.sendSingleCustom(GP.data.teacherName, s_say) //学生打招呼
    }
    //学生接收事件
    this.studentReceive = function (body) {
        //监听单聊信息
        var body = data.messages[0].content.msg_body
        if (body.text == "expire") {  //token过期
            expire()
        }
        if (body.text == "ppt") { //切换场景
            console.log(body)
            getPPT(body.url)
        }
        if (body.text == "draw") { //绘画完成
            console.log(body)
            getDraw(body.path)
        }
        if (body.text == "clear") { //清除屏幕
            console.log(body)
            getClear(body.path)
        }
        if (body.text == "on") {  //连接成功
            online()
        }
        if (body.text == "off") { //下线
            getTeacherOffline()
        }
        if (body.text == "time_out") {
            getTimeOut()
        }
    }

    function expire(){
        wx.showModal({
            title: '温馨提示',
            content: '房间已经过期，您可以选择任意一个故事，重新邀请好友',
            success: function () {
                wx.redirectTo({
                    url: '/pages/index/index',
                })
            },
        })
    }
    function getPPT(url){
        wx.showToast({
            title: '更换PPT成功',
            icon: "success",
        })
        GP.setData({
            bgImageUrl: url,
        })
    }
    function getDraw (path) {
        GP.setData({
            drawLine: path
        })
    }
    function getClear(path) {
        GP.setData({
            drawLine: path
        })
    }

    function online(){
        wx.hideLoading()
        GP.setData({
            isConnectSuccess: true,
            liveConfig: body.liveConfig
        })
    }
    function getTeacherOffline(){
        wx.showModal({
            title: '老师下线',
            success: function () {
                wx.redirectTo({
                    url: '/pages/index/index',
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
                    url: '/pages/index/index',
                })
            },
        })
    }
})