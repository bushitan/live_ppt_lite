
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
    this.expire = function(){
        wx.showModal({
            title: '温馨提示',
            content: '房间已经过期，您可以选择任意一个故事，重新邀请好友',
            success:function(){
                wx.redirectTo({
                    url: '/pages/index/index',
                })
            },
        })
    }

    //1改变场景
    this.getStageChange = function(stage){
        var custom = stage
        console.log(custom)
        wx.showToast({
            title: '设置主题成功',
            icon: "success",
        })
        GP.setData({
            stage: custom
        })
        console.log(GP)
    }

    //房主下线
    this.getTeacherOffline = function(){
        wx.showModal({
            title: '老师下线',
            success: function () {
                wx.redirectTo({
                    url: '/pages/index/index',
                })
            },
        })
    }

    //房主到时间，踢下线
    this.getTimeOut = function(){
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