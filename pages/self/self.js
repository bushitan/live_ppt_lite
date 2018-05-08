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
    
        //临时图片
        tempList: [
            "http://img.12xiong.top/ppt_read1.jpg", "http://img.12xiong.top/ppt_read2.jpg",
            "http://img.12xiong.top/ppt_read1.jpg", "http://img.12xiong.top/ppt_read2.jpg",
            "http://img.12xiong.top/ppt_read1.jpg", "http://img.12xiong.top/ppt_read2.jpg"
        ],

        //我的分类
        myList:[],//场景的二维数组

        userName: "",//老师名字
        // userName:'live_pvp_user_5', //学生

        //页面显示
        show:{
            // stage: false, //直播舞台
            // menu: false, //菜单
            // theme:false, //更换主题
            selectTag:false,
            story: true, //故事菜单
            member: false,  //会员支付
        },

        playerTab: ["我的文件", "公告", "会务直播", "培训", "通讯录", "问题反馈"],

        tagList: [],
        tagNameList: [],   
        // tagIndex:0,

        focus:false, //自动获取焦点
        dialogvisible: false,
        // dialogvisible: true,
        options: {
            showclose: false,
            showfooter: true,
            closeonclickmodal: true,
            fullscreen: false
        },
        title: '添加标签',
        opacity: '0.4',
        width: '85',
        position: 'center',
        positionIndex: 0
    },
    toCompany(){
        wx.navigateTo({
            url: '/pages/company/company',
        })
    },

    //Temp 临时文件
    //上传临时文件到指定目录下
    choiceTag(e){
        if (GP.data.tagList.length == 0 ){
            wx.showModal({
                title: '没有标签',
                content: '请在“我的文件”中添加新标签才能分类',
            })
            return 
        }

        console.log(e.detail)
        var tagIndex = e.detail.tagIndex
        var url = e.detail.url
        var tag_id = GP.data.tagList[tagIndex].tag_id
        console.log(tag_id,url)
        Scripte.uploadFile(tag_id, url)
        // TODO 上传文件

    },

    // //1 点击标签
    // clickTab: function (e) {
    //     if (e.detail == 0)
    //         Scripte.ShowStory()
    //     else
    //         Scripte.ShowMember()
    // },

    // 2.1 获取临时图片
    addTempImage() {
        console.log("temp") 
        wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
                var _list = APP.globalData.tempList 
                for (var i = 0; i < tempFilePaths.length; i++) {
                    // _list.push({ url: tempFilePaths[i] })
                    _list.unshift( {url:tempFilePaths[i]} )
                }
                APP.globalData.tempList = _list
                GP.getTempImageList()

            }
        })
    },
    // 2.2 获取临时图片
    getTempImageList(){
        // return
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
            url: API.PPT_SELF_GET_TAG,
            success: function (res) {
                // GP.setData({
                //     tagList: [{ name: "我的",tag_id:1},],
                //     tagNameList: ["我的", "frjie", "143321", "我的", "12", "frjie",  "143321", "我的", "frjie", "143321"],   
                // })
                var tag_list = res.data.tag_list
                var tagNameList = []
                for (var i = 0; i < tag_list.length;i++)
                    tagNameList.push(tag_list[i].tag_name)
                GP.setData({
                    tagList:tag_list,
                    tagNameList:tagNameList,
                })
                GP.clickTag()
                // var tag_id = 1
                // GP.getImageByTag(tag_id)
            },
        })
    },

    clickTag(e) {
        var index = e==undefined? 0 :e.detail
        var tag_id = GP.data.tagList[index].tag_id
        GP.getImageByTag(tag_id)
    },
    // 4 获取标签下的图片
    getImageByTag(tag_id){
        console.log(tag_id)
        API.Request({
            url: API.PPT_SELF_GET_FILE,
            data: { tag_id: tag_id},
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


    // 5 增加标签
    addTag(){
        this.setData({
            focus:true,
            dialogvisible: true,
            inputTagName: "",
        })
    },
    //输入标签名字
    bindInputTagName(e){
        var input = e.detail.value;
        console.log(input)
        GP.setData({ inputTagName:input})
    },
    //确定 --- 添加标签
    inputConfirm(){
        if (GP.data.inputTagName == ""){
            wx.showModal({
                title: '添加标签失败',
                content: '未输入标签名字',
            })
            return
        }
        API.Request({
            url: API.PPT_SELF_ADD_TAG,
            data: { tag_name: GP.data.inputTagName },
            success: function (res) {
                wx.showModal({
                    title: '添加标签成功',
                })
                GP.getTag()
            },
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
        // API.Request({
        //     url: API.PVP_STORY_GET_LIST,
        //     success: function (res) {
        //         GP.getTag()
        //     },
        // })
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
    toTeacher(){
        wx.navigateTo({
            url: '/pages/room/room',
        })
    },

    onShow(){
        GP.getTempImageList()
    },
    onLoad: function (options) {
        GP = this
        APP.globalData.currentPage = this //当前页面的钩子

        Scripte.Init(APP, GP, API, APP.globalData.JMessage)

        GP.getTag() //获取标签列表
    },



    //分享好友
    onShareAppMessage() {
        // return {
        //     title:"我给你讲个故事",
        //     path: "/pages/index/index?room_key=" + GP.data.roomKey,
        // }
    },
})



