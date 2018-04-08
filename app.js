//app.js

var JMessage = require('utils/im/jm.js')
var KEY = require('utils/key.js')
var API = require('utils/api.js');
var GP
var tempPage = null
App({
    onLaunch: function () {
        //初始化故事列表
        GP = this
        // GP.globalData.storyList = wx.getStorageSync("story_list")
        GP.globalData.storyList = [{ "list": [{ "pusher_height": "150rpx", "stage_id": 1, "pusher_x": "125rpx", "stage_background": "../../images/1.jpg", "pusher_width": "125rpx", "stage_orientation": 1, "stage_audio": "", "player_width": "120px", "stage_cover": "../../images/pusher_logo.png", "pusher_image": "../../images/pusher_logo.png", "stage_height": "", "player_height": "50px", "player_y": "600rpx", "stage_width": "100vw", "player_image": "../../images/1.jpg", "player_x": "80rpx", "pusher_y": "480rpx" }, { "pusher_height": "", "stage_id": 2, "pusher_x": "", "stage_background": "../../images/pusher_logo.png", "pusher_width": "", "stage_orientation": 0, "stage_audio": "", "player_width": "", "stage_cover": "../../images/1.jpg", "pusher_image": "", "stage_height": "", "player_height": "", "player_y": "", "stage_width": "", "player_image": "", "player_x": "", "pusher_y": "" }, { "pusher_height": "", "stage_id": 3, "pusher_x": "", "stage_background": "../../images/pusher_logo.png", "pusher_width": "", "stage_orientation": 0, "stage_audio": "../../images/1.jpg", "player_width": "", "stage_cover": "../../images/1.jpg", "pusher_image": "", "stage_height": "", "player_height": "", "player_y": "", "stage_width": "", "player_image": "", "player_x": "", "pusher_y": "" }], "name": "次火锅", "description": "一家人温馨吃火锅" }]
        // GP.onIM()
    },

    globalData: {
        userInfo: null, 
        currentPage:null,//当前页面
        isMember:false,
        // stage:null,//当前舞台
        storyList:[],//故事列表
        JMessage: null,//IM系统
        teacher_name: "",//教师名字
        student_name: "",//学生名字

        //
        liveConfig :{},
    },

    // 初始化IM
    initIM(teacherName, passWord) {
        // tempPage = _GP

        if (this.globalData.JMessage == null) {
            JMessage.init("", teacherName, passWord, GP.IMSuccess);
            this.globalData.JMessage = JMessage
        }

    },

    // IM登陆成功
    IMSuccess() {
        this.globalData.currentPage.IMSuccess() //登陆成功事件
        JMessage.JIM.onMsgReceive(function (data) {
            //
            GP.globalData.currentPage.IMMsgReceive(data) //监听事件
        })

    },

})