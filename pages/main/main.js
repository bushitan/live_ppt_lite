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

    },

    //分享好友
    onShareAppMessage() {
        // return {
        //     title:"我给你讲个故事",
        //     path: "/pages/index/index?room_key=" + GP.data.roomKey,
        // }
    },
})



