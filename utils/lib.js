
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
    this.sendStudentOnline = function () {
        var t_call = {
            text: "on",
            liveConfig: GP.data.liveConfig
        }
        JMessage.sendSingleCustom(GP.data.studentName, t_call)
    }
    this.getStudentOffline = function(){
        wx.showModal({
            title: '学生下线',
            success: function () {
                wx.navigateBack()
            },
        })
    }
})