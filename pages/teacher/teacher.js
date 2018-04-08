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

        isMember: false,//是否会员
        isOnline:false, //学生未上线
        showTheme: false, //显示主题
        // showTool: true,//显示根据
        showTool: false,//显示根据
        // isHeng:false,//是否横屏

        token:null,//验证是否能够连接
        teacherName: null, //IM账号
        passWord: null, //IM密码
        studentName: null, //IM账号

        liveConfig:{},//直播配置
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
    // 换主题
    themeSwitch() {
        GP.setData({ 
            showTheme: !GP.data.showTheme,
            showTool: GP.data.showTheme,
        })
    },
    menuSwitch(){
        GP.setData({
            showTool: !GP.data.showTool,
        })
    },
    // 选择
    clickStoryImage(e) {
        // GP.setData({ showTheme: true })
        var rol = e.detail.rol
        var col = e.detail.col
        GP.setData({
            rol: rol,
            col: col,
            stage: GP.data.storyList[rol].list[col],
            showTheme: false,
            showTool: true,
        })
        
        Scripte.sendStage()

        //4 im 更换主题，想学生发送消息
        if (GP.data.studentName == null){
            wx.showToast({
                title: '对方不在线，请邀请好友',
                icon:"loading",
            })
        }
        else
            Scripte.sendStage()
    },
    next() {
        // console.log("下一页")
        var rol = GP.data.rol
        var col = GP.data.col
        if (col < GP.data.storyList[rol].list.length - 1) {//不是最后一页
            var temp_col = col + 1
            GP.setData({
                col: temp_col,
                stage: GP.data.storyList[rol].list[temp_col],
            })
        }
        Scripte.sendStage()
    },
    back() {
        // console.log("下一页")
        var rol = GP.data.rol
        var col = GP.data.col
        if (col > 0) {//不是最后一页
            var temp_col = col - 1
            GP.setData({
                col: temp_col,
                stage: GP.data.storyList[rol].list[temp_col],
            })
        }
        Scripte.sendStage()
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        APP.globalData.currentPage = this //当前页面设置为全局变量
        // console.log(options.col, options.rol)
        // var rol = parseInt(options.rol)
        // var col = parseInt(options.col)
        // var _stage = APP.globalData.storyList[rol].list[col]
        // GP.setData({
        //     rol:rol,
        //     col:col,
        //     stage: _stage,
        //     storyList: APP.globalData.storyList,
        //     isMember: APP.globalData.isMember, //是否会员
        //     // isHeng: _stage.stage_orientation == KEY.HORIZONTAL? true:false, //设置方向
        // })

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
        // GP.initIM()
        // GP.initMusic(_stage.stage_background_audio)

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


    initMusic(src){
        const innerAudioContext = wx.createInnerAudioContext()
        // innerAudioContext.autoplay = true
        innerAudioContext.src = src
        innerAudioContext.loop = true
        innerAudioContext.play()
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

    // onUnload() {
    //     JMessage.JIM.loginOut();
    // },

})

    // initIM(){
    //     var user_info = wx.getStorageSync(KEY.USER_INFO)
    //     var domain = "?vhost=live.12xiong.top"
    //     var pushBase = "rtmp://video-center.alivecdn.com/pvplive/"
    //     var playerBase = "rtmp://live.12xiong.top/pvplive/"
    //     var liveConfig = {
    //         teacherPusher: pushBase + "room_" + user_info.user_id + "_teacher" + domain,
    //         teacherPlayer: playerBase + "room_" + user_info.user_id + "_teacher" ,
    //         studentPusher: pushBase + "room_" + user_info.user_id + "_student" + domain,
    //         studentPlayer: playerBase + "room_" + user_info.user_id + "_student",
    //     }
    //     console.log(liveConfig)

    //     var teacherName = "live_pvp_user_" + user_info.user_id
    //     var passWord = "123"
    //     GP.setData({
    //         liveConfig:liveConfig,
    //         teacherName: teacherName,
    //         passWord: passWord,
    //     })
    //     JMessage.init("", teacherName, passWord, GP.IMSuccess);
    // },

    // IMSuccess(){
    //     JMessage.JIM.onMsgReceive(function (data) {
    //         var body = data.messages[0].content.msg_body

    //         if (body.text == "check") { //接收学生的上线信息
    //             Scripte.getCheck(body.student_name, body.token)
    //         }

    //         // if (body.text == "on") { //接收学生的上线信息
    //         //     GP.getStudentOnline(body.student_name)
    //         // }

    //         if (body.text == "off") { //接收学生的下信息
    //             Scripte.getStudentOffline(body.student_name)
    //         }

    //     })
    // },

   



    // //2 监听学生上线消息
    // getMessage(body) {


    //     if (body.text == "check") { //接收学生的上线信息
    //         var s_say = { text: "check", student_name: GP.globalData.student_name }
    //         APP.globalData.JMessage.sendSingleCustom(GP.globalData.teacher_name, s_say) //学生打招呼
    //     }

    //     if (body.text == "on") { //接收学生的上线信息
    //         GP.getStudentOnline(body.student_name)
    //     }

    //     if (body.text == "off") { //接收学生的下信息
    //         GP.getStudentOffline(body.student_name)
    //     }

    // },

    // //1 提示学生下线
    // getStudentOffline(student_name) {
    //   wx.showModal({
    //     title: '学生下线',
    //     success:function(){
    //       wx.navigateBack()
    //     },
    //   })
    //   // //2 存储学生信息
    //   // APP.globalData.student_name = student_name //学生名字
    //   // //3发送回复
    //   // GP.sendStage(student_name)
    // },
    //1 提示学生上线
    // getStudentOnline(student_name){
    //     wx.showModal({
    //         title: '学生上线',
    //     })
    //     GP.setData({
    //       isOnline:true,
    //     })
    //     //2 存储学生信息
    //     APP.globalData.student_name = student_name //学生名字
    //     //3发送回复
    //     GP.sendStage(student_name)
    // },
    // //3 像学生发送舞台信息
    // sendStage(student_name) {

    //     var t_call = {
    //         text: "stage",
    //         stage: GP.data.stage
    //     }
    //     APP.globalData.JMessage.sendSingleCustom(APP.globalData.student_name, t_call)
    //     // APP.globalData.JMessage.sendSingleCustom(student_name, t_call)
    //     // APP.globalData.JMessage.sendSingleCustom('bushitan', t_call)
    // },
    

    // 倒计时
    // SetCountDown() {
    //     var memberTempLive = wx.getStorageSync(KEY.MEMBER_TEMP_LIVE)
    //     if (memberTempLive === "" || memberTempLive==0 ){
    //         //TODO 踢人下线
    //     }
    //     else{

    //         memberTempLive--
    //         wx.setStorageSync(KEY.MEMBER_TEMP_LIVE, memberTempLive)
    //     }

    //     var leftTime = 2
    //     intervarID = setInterval(
    //         function () {
    //             // GP.setData({
    //             //     clock: '录音倒计时：' + leftTime + "秒"
    //             // })
    //             console.log(leftTime)
    //             leftTime = leftTime - 1
    //             if (leftTime == 0) {
    //                 clearInterval(intervarID);
    //                 GP.getOut() //踢下线
                   
    //             }
    //         },
    //         1000
    //     )
    // },

    // //踢出去
    // getOut(){
    //     wx.showModal({
    //         title: '时间到',
    //     })
    //     var t_call = {
    //         text: "time_out",
    //     }
    //     APP.globalData.JMessage.sendSingleCustom(APP.globalData.student_name, t_call)
    // },



    // /**
    //  * 用户点击右上角分享
    //  */
    // ott: function () {

    //     var path = "/pages/student/student?room_key=" + GP.data.roomKey //原始分享路径
    //     return {
    //         title: "我给你讲个故事",
    //         path: path,
    //         success: function (res) {
    //             if (tempLive <= 0) {
    //                 wx.showModal({
    //                     title: '临时次数已到',
    //                     content: '成为会员可以无限次使用哦',
    //                 })
    //             }
    //         },
    //     }

    //     GP.SetCountDown()


    //     var _live = 1 //每日免费次数
    //     var _today = new Date().getDay()
    //     var tempLive = wx.getStorageSync(KEY.MEMBER_TEMP_LIVE)
    //     var path = "/pages/student/student?room_key=" + GP.data.roomKey //原始分享路径


    //     var refreshDay = wx.getStorageSync(KEY.MEMBER_REFRESH_DAY)
    //     if (refreshDay != _today) {  //日期不一样，重置次数
    //         tempLive = _live
    //         refreshDay = _today
    //         wx.setStorageSync(KEY.MEMBER_TEMP_LIVE, tempLive)
    //         wx.setStorageSync(KEY.MEMBER_REFRESH_DAY, refreshDay)
    //     }

    //     if (tempLive <= 0) { //分享次数没有，让学生直接跳到首页
    //         path = "/pages/index/index?time_out=true" //让受邀请的用户直接进入首页
    //     }
    //     return {
    //         title: "我给你讲个故事",
    //         path: path,
    //         success:function(res){
    //             if (tempLive <= 0) {
    //                 wx.showModal({
    //                     title: '临时次数已到',
    //                     content: '成为会员可以无限次使用哦',
    //                 })
    //             }
    //         },
    //     }
    // }