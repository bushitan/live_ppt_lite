// pages/student/student.js
const APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');
var Scripte = require('scripte.js');
var JMessage = require('../../utils/im/jm.js')

var GP
var intervarID

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // isConnectSuccess: false,
        isConnectSuccess: true,
        showTool: true,
        // showTool: false,

        teacherName: null,  //教师名字
        studentName: null,  //学生名字

        playerTab:["退出"],
    },
    //点击背景图，打开菜单
    stageClose() {
        wx.showModal({
            title: '退出房间',
            content:"退出后通话将断开",
            success: function (res) {
                if (res.confirm) {
                    var t_call = {
                        text: "off",
                    }
                    JMessage.sendSingleCustom(GP.data.teacherName, t_call)
                    wx.redirectTo({
                        url: '/pages/index/index',
                    })
                }
            },
        })
    },
    toIndex(){
        wx.redirectTo({
            url: '/pages/index/index',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        APP.globalData.currentPage = this //当前页面设置为全局变量
        
        //初始化教师账号
        GP.setData({
            teacherName: options.teacher_name,
            token: options.token,
        })
        // 初始化loading图标
        wx.showLoading({
            title: '连麦中',
        })
        Scripte.Init(APP, GP, API, APP.globalData.JMessage) //初始化脚本
        GP.initLogin()//初始化登陆
        // GP.checkNetFail() //防止很久没反应


    },
    checkNetFail(){
        var leftTime = 2
        intervarID = setInterval(
            function () {
                if (leftTime >= 10){
                    clearInterval(intervarID) //清除进程
                    if (GP.data.isConnectSuccess == false)
                        wx.showModal({
                            title: '连接超时',
                            content: '返回首页',
                            success:function(res){
                                wx.redirectTo({
                                    url: '/pages/index/index',
                                })
                            },
                        })
                }
                leftTime++
            },
            1000
        )
    },

    //登陆一下，需要user_id
    initLogin() {
        API.Request({
            // url: API.PVP_ROOM_JOIN,
            url: API.PVP_STORY_GET_LIST,
            
            success: function (res) {
                //测试
                // GP.setData({
                //     stage: res.data.stage_list[0].list[0]
                // })
                GP.onInitIMStudent()
            },
        })
    },
    onInitIMStudent(){
        var user_info = wx.getStorageSync(KEY.USER_INFO)
        var studentName = "live_pvp_user_" + user_info.user_id
        var passWord = "123"
        //浜村账号密码
        GP.setData({
            studentName: studentName,
            passWord: passWord,
        })
        APP.initIM(studentName, passWord)
    },

    IMSuccess() {


        //发出验证token的请求
        var s_say = {
            text: "check",  //验证
            student_name: GP.data.studentName, //学生名字
            token: GP.data.token,//验证token
        }
        JMessage.sendSingleCustom(GP.data.teacherName, s_say) //学生打招呼
        // GP.listen()
    },

    //监听进程
    IMMsgReceive(data) {
        //监听单聊信息
        var body = data.messages[0].content.msg_body
        if (body.text == "expire") {  //token过期
            Scripte.expire()
        }
        if (body.text == "ppt") { //切换场景
            console.log(body)
            Scripte.getPPT(body.url)
        }
        if (body.text == "draw") { //绘画完成
            console.log(body)
            Scripte.getDraw(body.path)
        }
        if (body.text == "clear") { //清除屏幕
            console.log(body)
            Scripte.getClear(body.path)
        }
        if (body.text == "on") {  //连接成功
            wx.hideLoading()
            GP.setData({
                isConnectSuccess: true ,
                liveConfig: body.liveConfig
            })
        }
        if (body.text == "off") { //下线
            Scripte.getTeacherOffline()
        }
        if (body.text == "time_out") {
            Scripte.getTimeOut()
        }
    },

    onShareAppMessage: function () {

    }
})


