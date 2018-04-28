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
        tagList: [],
        tagNameList: [],   
        tagIndex:0,
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

    
    onLoad: function (options) {
        GP = this
        APP.globalData.currentPage = this //当前页面的钩子
        Scripte.Init(APP, GP, API, APP.globalData.JMessage)
        GP.getTag() //获取标签列表
    },
    //分享好友
    onShareAppMessage() {
    },
})



