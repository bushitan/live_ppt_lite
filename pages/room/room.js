// pages/teacher/teacher.js
const APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');
var Scripte = require('scripte.js');
var JMessage = require('../../utils/im/jm.js')

var teacher = "live_app_3"
var student = 'live_pvp_user_5'
var GP
var intervarID


Page({
    /**
     * 页面的初始数据
     */
    data: {
        playerTab: ["直播", "PPT", "退出"],
        isTeacher: true,//是否会员
        
        isOnline:false, //学生未上线

        // token: null,//验证是否能够连接
        token: "1",//验证是否能够连接

        teacherName: null, //IM账号
        passWord: null, //IM密码
        studentName: null, //IM账号

        liveConfig:{},//直播配置
        
        tabIndex:0,
        pptList:[],
        showGallery:false,
    },

    initLive() {
        var user_info = wx.getStorageSync(KEY.USER_INFO)
        var domain = "?vhost=live.12xiong.top"
        var pushBase = "rtmp://video-center.alivecdn.com/pvplive/"
        var playerBase = "rtmp://live.12xiong.top/pvplive/"
        var teacherName = "live_pvp_user_" + user_info.user_id
        var liveConfig = {
            teacherName: teacherName,
            teacherPusher: pushBase + "room_" + user_info.user_id + "_teacher" + domain,
            teacherPlayer: playerBase + "room_" + user_info.user_id + "_teacher",
            studentPusher: pushBase + "room_" + user_info.user_id + "_student" + domain,
            studentPlayer: playerBase + "room_" + user_info.user_id + "_student",
        }
        console.log(liveConfig)
        GP.setData({
            liveConfig: liveConfig,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        APP.globalData.currentPage = this //当前页面设置为全局变量

        if (options.is_student == true) {
            GP.setData({ isTeacher: false, })
        }
        else {
            GP.initLive() //初始化live链接
        }


        GP.initIM() //登陆IM
        Scripte.Init(APP, GP, API, JMessage) //初始化脚本
        GP.getPPT()
    },
    /**IM初始化 */
    initIM() {
        var user_info = wx.getStorageSync(KEY.USER_INFO)
        var teacherName = "live_pvp_user_" + user_info.user_id
        var passWord = "123"
        GP.setData({
            teacherName: teacherName,
            passWord: passWord,
        })
        JMessage.init("", teacherName, passWord, GP.IMSuccess);

    },

    // IM登陆成功
    IMSuccess() {
        if(GP.data.isTeacher)
            GP.isTeacherSuccess()
        else
            GP.isStudentSuccess()
    },

    isStudentSuccess() {
        GP.initLive() //初始化live链接
        Scripte.studentOnline() //学生上线通知
        JMessage.JIM.onMsgReceive(function (data) {
            Scripte.teacherReceive(body)
        })
        
    },

    isTeacherSuccess(){
        GP.initLive() //初始化live链接
        JMessage.JIM.onMsgReceive(function (data) {
            // GP.IMMsgReceive(data) //监听事件

            Scripte.teacherReceive(body)
        })
    },






























    switchGallery(){
        GP.setData({ showGallery: !GP.data.showGallery})
    },

    addImage(){
        wx.chooseImage({
            count: 1, //
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var tempFilePaths = res.tempFilePaths[0]; //获取成功，读取文件路径

                GP.setData({
                    tabIndex: 0,
                    bgImageUrl: tempFilePaths,
                })
                APP.globalData.JMessage.sendSinglePic({
                    'target_username': '<target_username>',
                    'target_nickname': '<target_nickname>',
                    'appkey': '<appkey>',
                    'image': tempFilePaths //设置图片参数
                }).onSuccess(function (data, msg) {
                    //TODO
                    
                }).onFail(function (data) {
                    //TODO
                })
            }
        })
    },

    //点击tab菜单
    clickTab(e){
        GP.setData({
            tabIndex:e.detail
        })
        if (e.detail == 2){
            GP.stageClose()
        }
    },
    // 发送ppt
    clickPPTImage(e){
        var url = e.detail
        console.log(url)
        GP.switchGallery()
        GP.setData({
            tabIndex: 0,
            bgImageUrl:url,
        })
        Scripte.sendPPT(url)
    },

    //绘画完毕
    drawComplete(e) {
        console.log(e)
        Scripte.sendDraw(e.detail)
    },
    //清除屏幕
    drawClear(e) {
        console.log(e)
        Scripte.sendClear(e.detail)
    },
    /**
     * 1 菜单功能
     */
    //点击背景图，打开菜单
    stageClose() {
        wx.showModal({
            title: '退出房间',
            content:"退出后通话将断开",
            success:function(res){
                if(res.confirm){
                    if (GP.data.studentName != null) {
                        var t_call = {
                            text: "off",
                            stage: GP.data.stage
                        }
                        JMessage.sendSingleCustom(GP.data.studentName, t_call)
                    }
                    // wx.navigateBack({})
                    wx.redirectTo({
                        url: '/pages/main/main',
                    })
                }
            },
        })
    },



    // 我的图片
    getPPT() {
        GP.setData({
            pptList: [
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
            ],
        })
        // API.Request({
        //     url: API.LITE_USER_GET_PPT,
        //     success: function (res) {
        //         console.log(res)
        //         GP.setData({
        //             pptList: res.data.ppt_list,
        //             // pptTagList: res.data.ppt_list,
        //         })
        //     }
        // })
    },
    onShow(){
        //保持长列
        wx.setKeepScreenOn({
            keepScreenOn: true
        });
    },

    IMSuccess() {
        console.log('teacher login success')
    },


    onShareAppMessage: function () {
        var newToken = "1"
        var path = "/pages/student/student?teacher_name=" + GP.data.teacherName + "&token=" + newToken //原始分享路径
        GP.setData({
            token: newToken
        })
        console.log(path)
        return {
            title: "我给你讲个故事",
            // imageUrl: GP.data.stage.stage_cover,
            path: path,
        }
    },

})
