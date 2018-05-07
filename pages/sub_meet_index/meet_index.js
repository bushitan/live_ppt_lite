
var APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');
var GP

Page({
  data: {
    isMember:false,

    tagList: ["5月2日", "5月3日"],
    coverList:[],
    matrix: [
        [

            {
                start_time: "8:00",
                end_time: "12:00",
                title: "波分产品培训",
                summary: "详细讲解本次波分安装的关键技术",
                des: "20楼会议厅",
            },

            {
                start_time: "14:00",
                end_time: "17:00",
                title: "波分技术培训",
                summary: "机房施工步骤、安全注意事项",
                des: "20楼会议厅",
            }
        ],
        [
            {
                start_time: "8:00",
                end_time: "17:00",
                title: "波分安装实战演练",
                summary: "在实验室进行实战演练，每个操作员必须严格按照步骤，完成标准操作",
                des: "6楼实验室",
            }
        ],
    ],
  },

  onReady() {
    GP = this

    GP.setData({
        coverList: GP.data.matrix[0]
    })
    // GP.onInit()
    // APP.checkMember(GP.success)
  },

  // 点击tab
  clickTag(e) {
      console.log(e.detail)
      var index = e.detail

      GP.setData({
          coverList: GP.data.matrix[index]
      })

      // GP.getCoverList(GP.data.tagList[index].tag_id)
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
