//index.js
//获取应用实例
const APP = getApp()
var API = require('../../utils/api.js');
var Scripte = require('scripte.js');
var JMessage = require('../../utils/im/jm.js')

var teacher = "live_app_3"
var student = 'live_pvp_user_5'
var GP
Page({
    data: {
        //权限
        isMember:false,//是否会员
        isTeacher:true , //是否房主
        roomKey:"", //房间秘钥
        roomConfig:{}, //房间推流、拉流配置
        storyList:[],//场景的二维数组
        stage:{},//当前场景
        rol:0,
        col:0,

        userName: "live_app_3",//老师
        // userName:'live_pvp_user_5', //学生
        //页面显示
        show:{
            stage: false, //直播舞台
            menu: false, //菜单
            theme:false, //更换主题
            story: true, //故事菜单
            member:false,  //会员支付
        },


        playerTab:["选故事","会员"],
        pptList: [
            { url: 'http://img.12xiong.top/emoji_default.gif' },
            { url: '../../images/1.jpg' },
            { url: 'http://qiniu.308308.com/hx_245_2018_01_18_08_47_14.jpg' },
            { imaurlge_url: 'http://qiniu.308308.com/hx_245_2018_01_18_08_47_14.jpg' },
            { url: 'http://qiniu.308308.com/hx_245_2018_01_18_08_47_14.jpg' },
        ],
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
    //点击图片，选择场景
    clickStoryImage(e) {
        var rol = e.detail.rol
        var col = e.detail.col
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
        // wx.setStorageSync("test", {
        //     rol: rol,
        //     col: col,
        //     stage: GP.data.storyList[rol].list[col],
        // })
        console.log(GP.data.storyList[rol].list[col])
        GP.inStageTeacher()

        var t_call = {
            text: "stage",
            stage: GP.data.stage
        }
        Scripte.sendSingleCustom(student, t_call)

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

    // 老师进入舞台
    inStageTeacher() {
        Scripte.ShowStage()
        GP.setData({isTeacher:true,})
     },
    // 学生进入舞台
    inStageStudent() {
        Scripte.ShowStage()
        GP.setData({ isTeacher: false, })
    },


    /**
     * 3 舞台
     */
    stageClose() {
        wx.showModal({
            title: '是否离开舞台',
            content: '您离开后，通话将断开，可以重新邀请好友进入',
            success: function (res) {
                if (res.confirm) {
                    Scripte.ShowStory()
                    GP.setData({ isTeacher: true, })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
        
    },
    //点击背景图，打开菜单
    menuSwitch(){
        Scripte.MenuSwitch()
    },
    //打开主题
    themeOpen() {
        Scripte.ShowTheme()
    },
    //关闭主题
    themeClose() {
        Scripte.CloseTheme()
    },
    //选择主题
    themeConfirm() {
        GP.setData({
            showRoom: false,
        })
    },
    next() {
        // console.log("下一页")
        var rol = GP.data.rol
        var col = GP.data.col
        if (col < GP.data.storyList[rol].list.length - 1  ) {//不是最后一页
            var temp_col = col + 1 
            GP.setData({
                col: temp_col,
                stage: GP.data.storyList[rol].list[temp_col],
            })
        }
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
        
    },

    //分享好友
    onShareAppMessage() {
        return {
            title:"我给你讲个故事",
            path: "/pages/index/index?room_key=" + GP.data.roomKey,
        }
    },


    /**
     * IM系统
     */



    testTheme(){
        Scripte.sendSingleCustom()
    },



   

    onLoad: function (options) {


        GP = this
        // GP.onInit()
        Scripte.Init(APP, GP, API, JMessage)
        API.Request({
            url: API.PVP_STORY_GET_LIST,
            success: function (res) {
                console.log(res.data)
                APP.globalData.storyList = res.data.stage_list
                GP.setData({
                    storyList: res.data.stage_list,
                }) 
                // wx.setStorageSync("story_list", res.data.stage_list)
            },
        })
        return



        // var stage = wx.getStorageSync("test").stage
        // GP.setData({
        //     stage: stage
        // })
        // GP.inStageTeacher()

        // Scripte.RequestRoomCreate()
        console.log(options)
        //老师进入房间
        if (options.room_key == undefined || options.room_key == ""){
            Scripte.RequestStoryList()
        }else{ //学生进入房间
            Scripte.RequestStoryList()  
            // Scripte.RequestRoomJoin(options.room_key)
            //学生上线
            GP.inStageStudent()
            
            // {
            //     text: "stage",
            //         stage:GP.data.stage
            // },
    
        }
    },


    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
        })
    },
    
})









// onInit(){
//     var storyList = [
//         {
//             name: "吃火锅",
//             summary: "一家人温馨的小故事",
//             list: [
//                 {
//                     url: 'http://img.12xiong.top/emoji_default.gif',
//                     config: {
//                         background: {
//                             url: "../../images/1.jpg",
//                             audio_url: "",
//                             width: "100vw",
//                             // height: "100vh",
//                         },
//                         pusher: {
//                             url: "rtmp://video-center.alivecdn.com/AppName/StreamName?vhost=live.12xiong.top",
//                             cover_url: "../../images/pusher_logo.png",
//                             x: "125rpx",
//                             y: "480rpx",
//                             width: "125rpx",
//                             height: "150rpx",
//                         },
//                         player: {
//                             url: "rtmp://video-center.alivecdn.com/AppName/StreamName?vhost=live.12xiong.top",
//                             cover_url: "../../images/pusher_logo.png",
//                             x: "80rpx",
//                             y: "600rpx",
//                             width: "120px",
//                             height: "50px",
//                         },
//                     },
//                 },
//                 { url: '../../images/1.jpg' },
//                 { url: 'http://qiniu.308308.com/hx_245_2018_01_18_08_47_14.jpg' },
//             ],
//         },
//         {
//             name: "春游",
//             summary: "一起出去玩拉拉",
//             list: [
//                 { url: 'http://qiniu.308308.com/hx_245_2018_01_18_08_47_14.jpg' },
//                 { url: 'http://img.12xiong.top/emoji_default.gif' },
//                 { url: '../../images/1.jpg' },
//             ],
//         },
//     ]

//     // GP.setData({
//     //     config: storyList[0].list[0].config,
//     //     storyList: storyList,
//     // })
// },