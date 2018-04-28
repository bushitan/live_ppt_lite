
var APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');
var GP

Page({
  data: {
    isMember:false,
  },

  onReady() {
    GP = this
    GP.onInit()
    // APP.checkMember(GP.success)
  },
  success(res){
    GP.setData({
      isMember: res.data.is_member
    })
  },

  onInit() {
    API.Request({
        url: API.ROOM_GET_COVER,
      success: function (res) {
        console.log(res.data)
        GP.setData({
          room: res.data.room_dict,
          isTeacher: res.data.is_teacher,
        })
      },
    })
  },

  toLive(){
    wx.navigateTo({
        url: '/pages/sub_meet_live/meet_live',
    })
  },
  //封面 预约按钮
  prepar() {
    wx.showModal({
      title: '预约成功',
      content: '请按时观看直播',
      showCancel: false,
    })
  },
  onShareAppMessage() { },
})
