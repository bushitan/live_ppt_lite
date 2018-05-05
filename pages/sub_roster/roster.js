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
        rosterTagList: [],
        teamID :false,
    },
    //点击背景图，打开菜单
    click(e){
        var roster_tag_id = e.currentTarget.dataset.roster_tag_id
        console.log(roster_tag_id)
        wx.navigateTo({
            url: '/pages/sub_roster_info/roster_info?roster_tag_id=' + roster_tag_id,
        })
    },
    getRosterTag() {
        API.Request({
            url: API.PPT_TEAM_GET_ROSTER_TAG,
            data: { team_id: GP.data.teamID},
            success: function (res) {
                GP.setData({ rosterTagList: res.data.roster_tag_list})
            },
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this

        // GP.setData({ teamID: APP.globalData.teamID })
        GP.setData({ teamID:1 })
        GP.getRosterTag()
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