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
    
        //临时图片
        tempList: [
            "http://img.12xiong.top/ppt_read1.jpg", "http://img.12xiong.top/ppt_read2.jpg",
            "http://img.12xiong.top/ppt_read1.jpg", "http://img.12xiong.top/ppt_read2.jpg",
            "http://img.12xiong.top/ppt_read1.jpg", "http://img.12xiong.top/ppt_read2.jpg"
        ],
        //权限
        isTeamMember: !false,//是否会员
    },

    //加入团队
    join(){
        API.Request({
            url: API.PPT_TEAM_JOIN,
            success: function (res) {

            },
        })
        GP.setData({ isTeamMember:true})
    },

    // 2.2 获取临时图片
    getTempImageList(){
        return
        GP.setData({ tempList: APP.globalData.tempList })
    },

    // 2.3 移动图片
    updateImage() { 
        console.log('移动图片')
        wx.show
    },

    // 2.4 上传临时图片
    uploadTempImage() { 
        console.log('上传临时图片')
    },

    // 2.5 删除临时图片
    deleteImage() { 
        console.log('上传临时图片')
    },

    // 2.6 删除临时图片
    deleteTempImage() { 
        console.log('上传临时图片')
    },

    // 2.7 菜单图片
    menuImage() { 
        wx.showActionSheet({
            itemList: ["重新分类","删除"],
            success: function (res) {
                if (res.tapIndex == 0) {
                    GP.switchSelectTag()
                    GP.updateImage()
                }
                else{
                    GP.deleteImage()
                }
            },
        })
    },

    // 2.8 菜单临时图片
    menuTempImage() { 
        wx.showActionSheet({
            itemList: ["保存", "删除"],
            success: function (res) {
                if (res.tapIndex == 0) {
                    GP.switchSelectTag()
                    GP.uploadTempImage()
                }
                else {
                    GP.deleteTempImage()
                }
            },
        })
    },

    switchSelectTag(){
        var show = GP.data.show
        show.selectTag = !show.selectTag
        GP.setData({
            show: show
        })
        
    },



    //2.5 点击图片，预览
    clickImage(e){
        var image_url = e.detail
        console.log(image_url)
        wx.previewImage({
            urls: [image_url],
        })
    },

    // 3 获取标签列表
    getTag(){
        API.Request({
            url: API.PVP_STORY_GET_LIST,
            success: function (res) {
                GP.setData({
                    tagList: [{ name: "我的",tag_id:1},],
                    tagNameList: ["我的", "frjie", "143321", "我的", "12", "frjie",  "143321", "我的", "frjie", "143321"],   
                })
                GP.clickTag()
                // var tag_id = 1
                // GP.getImageByTag(tag_id)
            },
        })
    },

    // 4 获取标签下的图片
    getImageByTag(tag_id){
        console.log(tag_id)
        API.Request({
            url: API.PVP_STORY_GET_LIST,
            success: function (res) {
                var _myList = [
                    { url: "http://img.12xiong.top/ppt_read1.jpg" },
                    { url: "http://img.12xiong.top/ppt_read2.jpg" },
                    { url: "http://img.12xiong.top/ppt_read1.jpg" },
                    { url: "http://img.12xiong.top/ppt_read2.jpg" },
                    { url: "http://img.12xiong.top/ppt_read2.jpg" },
                ]
                GP.setData({
                    myList: _myList
                })
            },
        })
    },

    clickTag(e){
        var index = e ? e.detail : GP.data.tagIndex
        var tag_id = GP.data.tagList[index].tag_id
        GP.getImageByTag(tag_id)
    },

    // 5 增加标签
    addTag(){

        this.setData({
            focus:true,
            dialogvisible: true,
        })
    },

    // 6 删除标签
    deleteTag() { 
        if (GP.data.myList.length > 0){
            wx.showModal({
                title: '删除失败',
                content: '标签含有图片，请先移动图片至其他标签',
            })
            return 
        }
        API.Request({
            url: API.PVP_STORY_GET_LIST,
            success: function (res) {
               
            },
        })
    },

    // 7 更新标签
    updateTag() {
        // API.Request({
        //     url: API.PVP_STORY_GET_LIST,
        //     success: function (res) {

        //     },
        // })
    },

    // 8 标签的菜单
    menuTag(){
        console.log("长按拉起菜单")
        wx.showActionSheet({
            itemList: ["删除"],
            success:function(res){
                if (res.tapIndex == 0){
                    GP.deleteTag()
                }
                // else{

                // }
                
            },
        })
    },
    

    //创建房间
    toTeacher() {
        // wx.navigateTo({
        //     url: '/pages/room/room',
        // })
        wx.redirectTo({
            url: '/pages/room/room',
        })
    },

    onShow(){
        GP.getTempImageList()
    },
    onLoad: function (options) {
        GP = this
        APP.globalData.currentPage = this //当前页面的钩子
        // GP.checkTimeOut(options)
        // GP.onInit()
        Scripte.Init(APP, GP, API, APP.globalData.JMessage)
        GP.initIM()
        GP.getStoryList()

        // GP.getTag() //获取标签列表
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


    //分享好友
    onShareAppMessage() {
        // return {
        //     title:"我给你讲个故事",
        //     path: "/pages/index/index?room_key=" + GP.data.roomKey,
        // }
    },
})



