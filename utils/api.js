var KEY = require('key.js');

// var host_url = 'http://192.168.200.101:8000/live/'
var host_url = 'http://192.168.199.203:8000/live/';

// var host_url = 'http://127.0.0.1:8000/live/'; 
// var host_url = 'https://www.12xiong.top/live/';
// var host_url = 'http://www.12xiong.top:8010/live/';

var wxLoginUrl = host_url + 'lite/login/'
var APP_ID = "wxeb9623bdc85a64f4"

var APP
var GlobalData
var API_TIME = 5000               //检查进程时间间隔
var API_LOGIN_NONE = 0       //未登录
var API_LOGIN_ING = 1           //登陆中
var API_LOGIN_SUCCESS = 2   //已登录
var API_LIVE = 3                       //重连次数
function Request(options) {
    Init() //请求初始化
    InitRequest(options)
}

// 初始化
function Init() {
    APP = getApp()
    // console.log(APP)
    GlobalData = APP.globalData
    //初始化 全局变量
    if (GlobalData.apiIsLogin == undefined) {
        GlobalData.apiIsLogin = 0 //是否经登陆
        GlobalData.apiPreList = [] //未登录前的请求队列 
        GlobalData.apiFailList = [] //请求失败的队列
        GlobalData.apiThread = false

    }

    if (GlobalData.apiThread == false) {
        setInterval(
            function () {
                var opt = GlobalData.apiFailList.pop()
                // console.log(opt)
                if (opt != undefined) {
                    opt['live']--
                    _Request(opt)
                }
            }, API_TIME)
        GlobalData.apiThread = true
    }
}

function InitRequest(options) {

    options['live'] = API_LIVE //请求重连生命周期
    if (GlobalData.apiIsLogin == API_LOGIN_NONE) {     //未登录
        GlobalData.apiPreList.push(options)
        _RequestLogin()
        GlobalData.apiIsLogin = API_LOGIN_ING
    }
    else if (GlobalData.apiIsLogin == API_LOGIN_ING) {  //登陆中
        GlobalData.apiPreList.push(options)
    }
    else {                                                                             //登陆成功
        _Request(options)
    }
}

function _RequestLogin() {
    wx.login({
        success: function (res) {
            // var _session = wx.getStorageSync(KEY.SESSION)
            _Request({
                'live': API_LIVE,
                'url': wxLoginUrl,
                'data': {
                    js_code: res.code,
                    // session: _session,
                },
                'success': function (res) {
                    var object = res.data
                    wx.setStorageSync(KEY.SESSION, res.data.dict_user.session)
                    wx.setStorageSync(KEY.USER_INFO, res.data.dict_user)

                    GlobalData.apiIsLogin = API_LOGIN_SUCCESS //登陆成功
                    // 执行login == false时的请求
                    for (var i in GlobalData.apiPreList) {
                        _Request(GlobalData.apiPreList[i])
                    }
                    GlobalData.apiPreList = []
                },
            })
        },
        fail:function(res){
            console.log("fail",res)
        },
    });
}

// 普通登陆
function _Request(options) {
    // console.log(options)

    var data = options.data
    if (data == undefined)
        data = {}
    //session 不存在，设置为false
    var _session = wx.getStorageSync(KEY.SESSION)
    if (!_session) //检查session,不存在，为false
        _session = "false"
    data['session'] = _session  //每个请求都加session
    data['app_id'] = APP_ID  //每个请求都加session
    wx.request
        ({
            url: options.url,
            method: "GET",
            data: data,
            success: function (res) {
                if (options.success != undefined)
                    options.success(res)
            },
            fail: function (res) {
                if (options.fail != undefined)
                    options.fail(res)
                if (options['live'] > 0)
                    GlobalData.apiFailList.push(options) //将请求加入失败队列
            },
            complete: function (res) {
                if (options.complete != undefined)
                    options.complete(res)
            },
        })
}

module.exports = {
    Request: Request,
    LITE_LOGIN: wxLoginUrl,
    PVP_STORY_GET_LIST: host_url + 'ppt/file/get_list/',  //获取故事列表

    PPT_ROOM_ADD: host_url + 'ppt/room/add/',  //检测是否加入团队
    PPT_ROOM_DELETE: host_url + 'ppt/room/delete/',  //检测是否加入团队
    PPT_ROOM_CHECK: host_url + 'ppt/room/check/',  //检测是否加入团队


    PPT_TEAM_CHECK: host_url + 'ppt/team/check/',  //检测是否加入团队
    PPT_TEAM_JOIN: host_url + 'ppt/team/join/',  //获取我的图片
    PPT_TEAM_QUIT: host_url + 'ppt/team/quit/',  //获取我的图片
    PPT_TEAM_GET_TAG: host_url + 'ppt/team/get/tag/',  //获取团队标签
    PPT_TEAM_GET_FILE: host_url + 'ppt/team/get/file/',  //获取团队图片
    PPT_TEAM_GET_ROSTER_TAG: host_url + 'ppt/team/get/roster_tag/',  //获取通讯录标签
    PPT_TEAM_GET_ROSTER: host_url + 'ppt/team/get/roster/',  //获取通讯录


    PPT_SELF_STIMESTAMP: host_url + 'ppt/self/timestamp/',  //添加我的标签
    PPT_SELF_ADD_TAG: host_url + 'ppt/self/add/tag/',  //添加我的标签
    PPT_SELF_GET_TAG: host_url + 'ppt/self/get/tag/',  //获取我的图片
    PPT_SELF_GET_FILE: host_url + 'ppt/self/get/file/',  //获取我的图片
    PPT_SELF_UPLOAD_TOKEN: host_url + 'ppt/self/upload/token/',  //获取我的图片
    PPT_SELF_UPLOAD_CALLBACK: host_url + 'ppt/self/upload/callback/',  //获取我的图片
    
    
    // PPT_SELF_GET_ALL_FILE: host_url + 'ppt/self/get/all/file/',  //获取我的图片


    // PPT_NOTICE_GET: host_url + 'ppt/notic/get/',  //获取通知公告
    COVER_TAG_GET_LIST: host_url + 'cover/tag/get_list/',
    COVER_NEWS_GET_LIST: host_url + 'cover/news/get_list/',
    COVER_ARTICLE_GET: host_url + 'cover/article/get/',

    PPT_NOTICE_GET: host_url + 'ppt/train/get/',  //获取培训列表

    PPT_ARTICLE_GET_NOTICE: host_url + 'ppt/article/get/notic',  //文章内容--通知公告

    PPT_LIVE_INDEX: host_url + 'ppt/live/index/',  //获取当前直播封面
    PPT_LIVE_GET_ROOM: host_url + 'ppt/live/get/room/',  //获取当前直播房间内容
    PPT_LIVE_GET_MESSAGE: host_url + 'ppt/live/get/message/',  //获取直播聊天信息
    PPT_LIVE_SET_MEESAGE: host_url + 'ppt/live/set/message/',  //获取直播聊天信息

    PPT_ROSTER_GET_TAG: host_url + 'ppt/roster/get/tag/',  //获取直播聊天信息
    PPT_ROSTER_GET_INFO: host_url + 'ppt/roster/get/info/',  //获取直播聊天信息


    PPT_ISSUE_GET: host_url + 'ppt/issue/set/',  //问题反馈



    LITE_LOGIN: host_url + 'lite/login/',
    LITE_REGISTER: host_url + 'lite/register/',
    LITE_COMPANY_GET_INFO: host_url + 'lite/company/get/info/',
    LITE_USER_SET_INFO: host_url + 'lite/user/set/info/',
    LITE_USER_GET_PPT: host_url + 'lite/user/get/ppt/',

    COVER_TAG_GET_LIST: host_url + 'cover/tag/get_list/',
    COVER_NEWS_GET_LIST: host_url + 'cover/news/get_list/',
    COVER_ARTICLE_GET: host_url + 'cover/article/get/',

    ROOM_GET: host_url + 'room/get/',
    ROOM_GET_COVER: host_url + 'room/get/cover/',
    ROOM_CHECK_TEACHER: host_url + 'room/check/teacher/',
    ROOM_GET_LIST_BY_APP: host_url + 'room/get_list/app/',
    ROOM_ADD_MESSAGE: host_url + 'room/add/message/',

    ORDER_CHECK_MEMBER: host_url + 'order/check/member/',

};

