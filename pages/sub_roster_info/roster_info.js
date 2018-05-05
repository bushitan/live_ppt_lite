// pages/company/company.js
const APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');
var GP
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rosterList:[],
    },
    click(e) {
        var phone = e.currentTarget.dataset.phone
        wx.makePhoneCall({
            phoneNumber: phone,
        })
    },
    getRoster() {
        API.Request({
            url: API.PPT_TEAM_GET_ROSTER,
            data: { roster_tag_id: GP.data.rosterTagID },
            success: function (res) {
                GP.setData({ rosterList: res.data.roster_list })
            },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        GP.setData({ rosterTagID: options.roster_tag_id })
        // GP.setData({ rosterTagID: 1 })
        GP.getRoster()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
    
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
    
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
    
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
    
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    
    }
})