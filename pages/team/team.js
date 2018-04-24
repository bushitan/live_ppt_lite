//index.js
//获取应用实例
const APP = getApp()
var API = require('../../utils/api.js');
var Scripte = require('scripte.js');
var KEY = require('../../utils/key.js');
// var JMessage = require('../../utils/im/jm.js')
var GP
Page({
    data: {
        //权限
        isMember:false,//是否会员
        
        pptList:[],//场景的二维数组
        stage:{},//当前场景
        rol:0,
        col:0,

        userName: "",//老师名字
        // userName:'live_pvp_user_5', //学生

        //页面显示
        show:{
            stage: false, //直播舞台
            menu: false, //菜单
            theme:false, //更换主题
            story: true, //故事菜单
            member: false,  //会员支付
        },

        playerTab:["临时目录","私人收藏","团队收藏"],
        
    },


    /**
     * 1 选故事 
     */
    //点击标签
    clickTab: function (e) {
        if (e.detail == 0)
            Scripte.ShowStory()
        else
            Scripte.ShowMember()

    },
    clickPPTImage(e){
        console.log(e)
    },


    //点击图片，选择场景
    clickStoryImage(e) {
        // var rol = e.detail.rol
        // var col = e.detail.col
        var rol = e.detail.rol
        var col = 0 //默认第一个
        GP.setData({
            rol:rol,
            col:col,
            stage: GP.data.storyList[rol].list[col],
        })

        var options = "col=" + col + "&rol=" + rol
        wx.navigateTo({
            url: '/pages/teacher/teacher?' + options,
        })
        return
    },
    //创建房间
    toTeacher(){
        wx.navigateTo({
            url: '/pages/teacher/teacher',
        })
    },



    /**
     * 2 会员
     */
    payMember() {
        console.log("打开会员支付")
    },
    toTeacherPhone() {
        console.log("跳转到名师电话")
    },


    //分享好友
    onShareAppMessage() {
        return {
            title:"我给你讲个故事",
            path: "/pages/index/index?room_key=" + GP.data.roomKey,
        }
    },


    onLoad: function (options) {
        GP = this
        APP.globalData.currentPage = this //当前页面的钩子
        // GP.checkTimeOut(options)
        // GP.onInit()
        Scripte.Init(APP, GP, API, APP.globalData.JMessage)
        GP.initIM()
        GP.getStoryList()
    },

    /**IM初始化 */
    initIM(){
        var user_info = wx.getStorageSync(KEY.USER_INFO)
        var domain = "?vhost=live.12xiong.top"
        var pushBase = "rtmp://video-center.alivecdn.com/pvplive/"
        var playerBase = "rtmp://live.12xiong.top/pvplive/"
        var teacherName = "live_pvp_user_" + user_info.user_id
        var passWord = "123"

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
            teacherName: teacherName,
            passWord: passWord,
        })
        APP.globalData.liveConfig = liveConfig
        APP.initIM(teacherName, passWord)
    },
    IMSuccess(){
        console.log('denglu chen gong')
    },
    IMMsgReceive(){
        
    },

    //获取故事列表
    getStoryList() {
        GP.setData({
            pptList: [
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
        ],
        })
        // API.Request({
        //     url: API.PVP_STORY_GET_LIST,
        //     success: function (res) {
        //         console.log(res.data)
        //         APP.globalData.storyList = res.data.stage_list
        //         GP.setData({
        //             pptList: res.data.ppt_list,
        //         })
        //         // wx.setStorageSync("story_list", res.data.stage_list)
        //     },
        // })
     },

    
})



