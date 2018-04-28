// pages/article_video/article_video.js

var GP
var APP = getApp()

var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');

var ARTICLE_STYLE_NORMAL = 1,
    ARTICLE_STYLE_TEXT = 2,
    ARTICLE_STYLE_AUDIO = 3,
    ARTICLE_STYLE_VIDEO = 4,
    ARTICLE_STYLE_LIVE = 5
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // ARTICLE_STYLE_LIVE:5,
        mode:"",
        src:"http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        
        GP = this
        console.log(options)
        var article_id = options.article_id
        GP.getArticleContent(article_id)

        // APP.checkMember()
    },


    //获取文章内容
    getArticleContent: function (article_id) {
        
        API.Request
        ({
            url: API.COVER_ARTICLE_GET,
            data: {
                article_id: article_id,
            },
            success: function (res) {
                var object = res.data
            
                var _article_dict = object.dict_article
                //todo  判断style ，传入选择模板名称传入
                GP.setData({
                    article: _article_dict
                })
                GP.setMode(_article_dict.style)
                
            },
        })
        //   wx.request

    },

    setMode(style){

        var _mode
        if (style == ARTICLE_STYLE_NORMAL)
            _mode = "normal"
        if (style == ARTICLE_STYLE_TEXT)
            _mode = "text"
        if (style == ARTICLE_STYLE_AUDIO)
            _mode = "audio"
        if (style == ARTICLE_STYLE_VIDEO)
            _mode = "video"
        if (style == ARTICLE_STYLE_LIVE)
            _mode = "live"
            
        GP.setData({
            mode: _mode
        })        
        if (style == ARTICLE_STYLE_LIVE) {
            GP.initRoom()
            return
        }

    },
    initRoom(){
        API.Request({
            url: API.ROOM_GET,
            success: function (res) {
                console.log(res.data)
                GP.setData({
                    imRoomID: res.data.room_dict.im_num,
                    room: res.data.room_dict,
                    messageList: res.data.message_list,
                    isTeacher: res.data.is_pusher_user,
                })
            },
        })
    },

    sendMsg(){
        wx.showModal({
            title: '会议已经结束',
            content: '请关注我们的培训',
        })
    },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})