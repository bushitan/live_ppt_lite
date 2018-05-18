3423432//index.js
//获取应用实例
const APP = getApp()
var API = require('../../utils/api.js');
var Scripte = require('scripte.js');
var KEY = require('../../utils/key.js');
// var JMessage = require('../../utils/im/jm.js')
var GP
Page({
    data: {
        playerTab:["地理","历史","英语"],
        //临时图片
        tempList: [
            "http://img.12xiong.top/ppt_read1.jpg", "http://img.12xiong.top/ppt_read2.jpg",
            "http://img.12xiong.top/ppt_read1.jpg", "http://img.12xiong.top/ppt_read2.jpg",
            "http://img.12xiong.top/ppt_read1.jpg", "http://img.12xiong.top/ppt_read2.jpg"
        ],
        //权限
        // isTeamMember: !false,//是否会员
        teamID: false,//是否会员
    },
    //检测是否团队成员
    checkTeam(){
        API.Request({
            url: API.PPT_TEAM_CHECK,
            success: function (res) {
                GP.initTeamID(res)
            },
        })
    },
    //加入团队
    join(){

        wx.showModal({
            title: '加入索骏科技团队',
            content: '团队功能能在内侧，加入索骏科技，体验TeamHelper的团队功能',
            confirmText:"加入",
            success:function(res){
                if(res.confirm){
                    API.Request({
                        url: API.PPT_TEAM_JOIN,
                        data:{team_id : "1"},
                        success: function (res) {
                            GP.initTeamID(res)
                        },
                    })       
                }
            }
        })

    },
    initTeamID(res) {
        var teamID = res.data.team_id
        GP.setData({ teamID: teamID })
        APP.globalData.teamID = teamID
    },

    //创建房间
    toTeacher() {
        wx.redirectTo({
            url: '/pages/room/room',
        })
        
    },

    onShow(){
        GP.checkTeam()
    },
    onLoad: function (options) {
        GP = this
        Scripte.Init(APP, GP, API, APP.globalData.JMessage)
        // GP.getTag()
    },
    
    // 3 获取标签列表
    getTag() {
        API.Request({
            url: API.PPT_TEAM_GET_TAG,
            data: { team_id: 2 },
            success: function (res) {
                var tag_list = res.data.tag_list
                var tagNameList = []
                for (var i = 0; i < tag_list.length; i++)
                    tagNameList.push(tag_list[i].tag_name)
                GP.setData({
                    tagList: tag_list,
                    tagNameList: tagNameList,
                })
                GP.clickTag()
            },
        })
    },

    clickTag(e) {
        var index = e == undefined ? 0 : e.detail
        var tag_id = GP.data.tagList[index].tag_id
        GP.getImageByTag(tag_id)
    },
    // 4 获取标签下的图片
    getImageByTag(tag_id) {
        console.log(tag_id)
        API.Request({
            url: API.PPT_SELF_GET_FILE,
            data: { tag_id: tag_id },
            success: function (res) {
                GP.setData({
                    myList: res.data.file_list
                })
                // var _myList = [
                //     { url: "http://img.12xiong.top/ppt_read1.jpg" },
                //     { url: "http://img.12xiong.top/ppt_read2.jpg" },
                //     { url: "http://img.12xiong.top/ppt_read1.jpg" },
                //     { url: "http://img.12xiong.top/ppt_read2.jpg" },
                //     { url: "http://img.12xiong.top/ppt_read2.jpg" },
                // ]

            },
        })
    },








    //分享好友
    onShareAppMessage() {
        // return {
        //     title:"我给你讲个故事",
        //     path: "/pages/index/index?room_key=" + GP.data.roomKey,
        // }
        return {
            title: "欢迎来到小教室，这能让你轻松在线开课",
            imageUrl: "../../images/share_url3.jpg",
        }
    },
})



