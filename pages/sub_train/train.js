// pages/cover/cover.js
var GP

var APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');

// var JMessage = require('../../utils/jmessage-wxapplet-sdk-1.4.0.min.js')
// var MD5 = require('../../utils/md5.js')
// var RANDOM = require('../../utils/random.js')

// var jim = new JMessage({
//     // debug : true
// });

Page({

  /**
   * 页面的初始数据
   */
  data: {
      currentTabList: ["最新通知", "学习天地"],
      coverList: [],
    //   coverIndex:0,
    },

    // 点击tab
    clickTag(e) {
        console.log(e.detail)
        var index = e.detail

        GP.getCoverList(GP.data.tagList[index].tag_id)
    },  

    //点击文章
    clickCover(e) { 
        console.log(e.detail)
        var index = e.detail
        // console.log(GP.data.coverList[index])
        var article_id = GP.data.coverList[index].article_id
        wx.navigateTo({
            url: '/pages/article/article?article_id=' + article_id,
        })
    },

    onInit(){
        API.Request({
            url: API.COVER_TAG_GET_LIST,
            success: function (res) {
                console.log(res.data.list_tag)
                var _tab_list = []
                for (var i = 0; i < res.data.list_tag.length; i++)
                    _tab_list.push(res.data.list_tag[i].name)

                GP.setData({
                    currentTabList: _tab_list,
                    tagList: res.data.list_tag
                })
                GP.getCoverList(res.data.list_tag[0].tag_id)
            }
        })
    },

    getCoverList(tag_id){
        API.Request({
            url: API.COVER_NEWS_GET_LIST,
            data:{
                tag_id:tag_id,
            },
            success: function (res) {
                console.log(res.data)
                GP.setData({
                    coverList: res.data.list_cover,
                })
            }
        })
    },

    
    onLoad(){
        GP = this
        GP.onInit()

    },


})