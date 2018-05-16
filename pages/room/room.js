// pages/teacher/teacher.js
const APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');
var Scripte = require('scripte.js');
var JMessage = require('../../utils/im/jm.js')
var MD5 = require('../../utils/im/md5.js')

var teacher = "live_app_3"
var student = 'live_pvp_user_5'
var GP
var intervarID


Page({
    /**
     * 页面的初始数据
     */
    data: {
        playerTab: ["临时文件", "我的文件", "团队共享"],
        // isTeamMember: false,//是否加入团队
        teamID: false,
        isTeacher: true,//是否会员
        isOnline:false, //学生未上线
        isConnect:false,

        token: null,//验证是否能够连接
        // token: "1",//验证是否能够连接

        selfName:null, //本端账号
        otherName:null, //对端账号

        teacherName: null, //IM账号
        passWord: null, //IM密码
        // studentName: null, //IM账号

        liveConfig:{},//直播配置
        
        tabIndex:0,
        pptList:[],
        showGallery:false,
        print:[],
    },


// 完整链接
// teacherPusher: "rtmp://15628.livepush.myqcloud.com/live/15628_cf1302ad02?bizid=15628&txSecret=8fa94235423def94a4ae47cf18792b92&txTime=5AF31AFF",
// studentPlayer: "rtmp://15628.liveplay.myqcloud.com/live/15628_cf1302ad02?bizid=15628&txSecret=8fa94235423def94a4ae47cf18792b92&txTime=5AF31AFF",
    // initLive() {
    //     API.Request({
    //         url: API.PPT_ROOM_ADD,
    //         success: function (res) {
    //             GP.setData({
    //                 liveConfig: res.data.config_dict,
    //             })
    //         },
    //     })        
    // },

    onShow() {
        //保持长列
        wx.setKeepScreenOn({
            keepScreenOn: true
        });
        console.log(GP.data.options)
        console.log(JMessage.JIM.isConnect())
        // GP.onInit(GP.data.options)

        GP.roomAdd
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        // APP.globalData.currentPage = this //当前页面设置为全局变量
        //设置团队的teamID
        GP.setData({ teamID: APP.globalData.teamID })
        console.log("1231")

        Scripte.Init(APP, GP, API, JMessage) //初始化脚本
        wx.showToast({
            title: '连接中',
            icon:"loading",
        })
        GP.setData({ options: options})
        GP.onInit(options)
    },

    onInit(options){
        if (options.is_student == 'true') {  //学生登录，填写老师名字
            GP.setData({ isTeacher: false, teacherName: options.teacher_name, token: options.token, otherName: options.teacher_name })
            Scripte.roomCheck(options.teacher_name) //验证房间是否存在
            Scripte.initStudentIM()//IM学生初始化
            console.log(GP.data)
        }
        else {
            Scripte.roomAdd() //初始化live链接
            Scripte.initTeacherIM()//IM老师初始化
        }

        // GP.getPPT()  //获取自己文件夹内容
        GP.getTempFile()
        console.log("onload")
    },



    isTeacherSuccess() {
        JMessage.JIM.onMsgReceive(function (data,msg) {
            // GP.IMMsgReceive(data) //监听事件
            console.log(data, msg,"teacher")

            Scripte.teacherReceive(data)
            Scripte.utilReceive(data)
        })
    },
    isStudentSuccess() {
        JMessage.JIM.onMsgReceive(function (data) {
            clearInterval(interval)
            Scripte.studentReceive(data)
            Scripte.utilReceive(data)
        })
       
        
    },


    //上传本地图片
        // wx.chooseImage({
        //     count: 1, //
        //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        //     success: function (res) {
        //         var tempFilePaths = res.tempFilePaths[0]; //获取成功，读取文件路径
        //         JMessage.sendSinglePic(GP.data.otherName, tempFilePaths )
        //     }
        // })

    // 发送截图
    snapshot(e) {
        var url = e.detail
        console.log(url)
        //更改canvas背景
        GP.setData({
            // tabIndex: 0,
            bgImageUrl: url,
        })
        //保存到临时文件
        var _list = APP.globalData.tempList
        _list.unshift({url:url})
        APP.globalData.tempList = _list
        //实时更新
        if (GP.data.tabIndex == 0)
            GP.setData({ pptList: _list})

        //发送图片
        if (GP.data.otherName)  
            JMessage.sendSinglePic(GP.data.otherName, url)
    },

    //点击背景图，打开菜单
    stageClose() {
        wx.showModal({
            title: '退出房间',
            content: "退出后通话将断开",
            success: function (res) {
                if (res.confirm) {
                    if (GP.data.otherName != null) {
                        Scripte.sendOtherOffline()
                    }
                    JMessage.JIM.loginOut();
                    JMessage.JIM = null
                    Scripte.roomDelete() //初始化live链接
                    
                }
            },
        })
    },
    onUnload() {
        // JMessage.JIM.loginOut();
        // JMessage.JIM = null
    },










        // GP.initIM() //登陆IM

    /**IM初始化 */
    // initIM() {
    //     var user_info = wx.getStorageSync(KEY.USER_INFO)
    //     var selfName = "live_pvp_user_" + user_info.user_id
    //     console.log(selfName)
    //     var passWord = "123"
    //     GP.setData({
    //         selfName: selfName,
    //         passWord: passWord,
    //     })
    //     JMessage.init("", selfName, passWord, GP.IMSuccess);
    // },

    // // IM登陆成功
    // IMSuccess() {
    //     if(GP.data.isTeacher)
    //         GP.isTeacherSuccess()
    //     else
    //         GP.isStudentSuccess()
    // },
























    switchGallery(){
        GP.setData({ showGallery: !GP.data.showGallery})
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
        if (e.detail == 0) {
            GP.getTempFile()
        }
        if (e.detail == 1) {
            GP.getSelfTag()
        }
        if (e.detail == 2) {
            // GP.setData({ pptList: APP.globalData.tempList })
            GP.getTeamTag()
        }
    },
    getTempFile() {
        GP.setData({ pptList: APP.globalData.tempList })
    },
    // 获取自己标签
    getSelfTag() {
        GP.setData({ pptList: [] })
        API.Request({
            url: API.PPT_SELF_GET_TAG,
            success: function (res) {
                GP.renderTag(res)
            },
        })
    },
    //获取团队标签
    getTeamTag(){
        API.Request({
            url: API.PPT_TEAM_GET_TAG,
            data: { team_id: GP.data.teamID },
            success: function (res) {
                GP.renderTag(res)
            },
        })
    },
    renderTag(res){
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


    clickTag(e) {
        var index = e == undefined ? 0 : e.detail
        var tag_id = GP.data.tagList[index].tag_id
        API.Request({
            url: API.PPT_SELF_GET_FILE,
            data: { tag_id: tag_id },
            success: function (res) {
                GP.setData({
                    pptList: res.data.file_list
                })
            },
        })
    },

    








    // 发送ppt
    clickPPTImage(e){
        var url = e.detail
        console.log(url)
        GP.switchGallery()
        GP.setData({
            // tabIndex: 0,
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
  



    // 我的图片
    getPPT() {
        GP.setData({
            pptList: [
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
                { url: "http://img.12xiong.top/ppt_read1.jpg" },
                { url: "http://img.12xiong.top/ppt_read2.jpg" },
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

    onShareAppMessage: function () {
        if( GP.data.isTeacher == false ){
            console.log("请先结束课堂")
            var path = "/pages/main/main"
            return {
                title: "有个问题需要您的帮助",
                // imageUrl: GP.data.stage.stage_cover,
                path: path,
            } 
        }
        // teacher_name = live_pvp_user_19 & is_student=true
        var newToken = "1"
        var path = "/pages/room/room?is_student=true&teacher_name=" + GP.data.selfName + "&token=" + newToken + "&host_session=" + wx.getStorageSync(KEY.SESSION)["session"] //原始分享路径
        GP.setData({
            token: newToken
        })
        console.log(path)
        return {
            title: "有个问题需要您的帮助",
            // imageUrl: GP.data.stage.stage_cover,
            path: path,
        }
    },

})


 // var txTime = res.data.unix

                // function LiveUrl(txTime,style,user_name,role){
                //     var key = "87416c13d3f5cf4590615bb1f0138715"
                //     var stream_id = "15628_" + user_name + "_" + role
                //     var txSecret = MD5.hex_md5(key + stream_id + txTime)                    
                //     var base = "rtmp://15628.live" + style + ".myqcloud.com/live/" + stream_id
                //     var secret = "?txSecret=" + txSecret + "&txTime=" + txTime
                //     return base + secret
                // }
                // var user_id = wx.getStorageSync(KEY.USER_INFO).user_id
                // var teacherName = "live_ppt_user_" + user_id                
                // var liveConfig = {
                //     teacherName: teacherName,
                //     teacherPusher: LiveUrl(txTime, "push", teacherName,"teacher"),
                //     teacherPlayer: LiveUrl(txTime, "play", teacherName, "teacher"),
                //     studentPusher: LiveUrl(txTime, "push", teacherName, "student"),
                //     studentPlayer: LiveUrl(txTime, "play", teacherName, "student"),
                // }
                // console.log(liveConfig)
                // GP.setData({
                //     liveConfig: liveConfig,
                // })


                 // var i = 0
        // Scripte.sendStudentCheck() 
        // var interval = setInterval(
        //     function(){
        //         if (i < 15) {
        //             console.log(i)
        //             Scripte.sendStudentCheck()
        //             i++
        //         }else{
        //             wx.showModal({
        //                 title: '退出房间',
        //                 content: "房主不在线， 请重新视频求助",
        //                 showCancel: false,
        //                 success: function (res) {
        //                     wx.redirectTo({
        //                         url: '/pages/main/main',
        //                     })
        //                 },
        //             })
        //             clearInterval(interval) 
        //         }


        //     },
        //     2000,
        // )
