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
        isMember: false,//是否会员
        isOnline:false, //学生未上线
        showTheme: false, //显示主题
        // showTool: true,//显示根据
        showTool: false,//显示根据
        // isHeng:false,//是否横屏

        // token: null,//验证是否能够连接
        token: "1",//验证是否能够连接
        teacherName: null, //IM账号
        passWord: null, //IM密码
        studentName: null, //IM账号

        liveConfig:{},//直播配置
        tabIndex:0,
        pptList:[],
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
                    wx.navigateBack({})
                }
            },
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        APP.globalData.currentPage = this //当前页面设置为全局变量

        //学生的player为空

        var liveConfig = {
            teacherName: APP.globalData.liveConfig.teacherName,
            teacherPusher: APP.globalData.liveConfig.teacherPusher,
            teacherPlayer: APP.globalData.liveConfig.teacherPlayer,
            studentPusher: APP.globalData.liveConfig.studentPusher,
            studentPlayer: false,
        }
        GP.setData({
            liveConfig: liveConfig ,
            teacherName: APP.globalData.liveConfig.teacherName,
        })



        Scripte.Init(APP, GP, API, APP.globalData.JMessage) //初始化脚本

        GP.getPPT()
    },


    getPPT() {
        GP.setData({
            pptList: [
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

    //接收IM信息
    IMMsgReceive(data) {
        var body = data.messages[0].content.msg_body

        if (body.text == "check") { //接收学生的上线信息
            console.log(APP.globalData.liveConfig)
            GP.setData({liveConfig: APP.globalData.liveConfig}) //学生上线后，再设置推流地址
            Scripte.getCheck(body.student_name, body.token)
        }

        // if (body.text == "on") { //接收学生的上线信息
        //     GP.getStudentOnline(body.student_name)
        // }

        if (body.text == "off") { //接收学生的下信息
            Scripte.getStudentOffline(body.student_name)
        }
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
