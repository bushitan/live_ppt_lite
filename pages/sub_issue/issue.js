
var GP
var APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');


Page({
    data: {
        userInfo:{},
        lock:false,
        isSign:false,
        isTeacher:false,//是否教师
        planList: [{
            title: "音乐课",
            summary: "音乐欣赏、表演",
            des: "钢琴教室",
            start_time: '9:00',
            end_time: "10:00",
        }, {
            title: "美术课",
            summary: "水彩画创意",
            des: "手工教室",
            start_time: '10:10',
            end_time: "11:00",
        },
        ]
    },

    //点击头像，注册用户
    clickLogo(){
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo
          // console.log(userInfo)
          // wx.setStorageSync(KEY.USER_INFO, userInfo)
          GP.register(userInfo)
        },
        fail(res) {
          console.log(res)
          GP.authorize()
        }
      })
    },
    // 注册
    register(userInfo) {
      API.Request({
        url: API.LITE_REGISTER,
        method: 'get',
        data: userInfo,
        success(res) {
          GP.setData({
            userInfo: res.data.user_dict
          })
        },
      });
    },
    //用户授权
    authorize() {
      wx.showModal({
        title: '需要授权',
        content: '请在“用户信息”栏打钩',
        confirmText: '授权',
        success(res) { reGetInfo(res) },
      })
      function reGetInfo(res) {
        if (res.confirm)
          wx.openSetting({
            success: (res) => {
              if (!res.authSetting["scope.userInfo"])
                GP.clickLogo()
            }
          })
      }
    },





    formSubmit: function(e) {
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
    },
    formReset: function() {
      console.log('form发生了reset事件')
    },

    toLivePhone() {
        wx.navigateTo({
          url: '/pages/live_phone/live_phone',
        })
    },

    toPPT() {
        wx.navigateTo({
            url: '/pages/ppt/ppt',
        })
    },
    toVoiceRecord() {
        wx.navigateTo({
          url: '/pages/record/record',
        })
    },
    
    sign(){
        var userInfo = GP.data.userInfo
        if (userInfo.name == "" || userInfo.name == undefined || userInfo.phone == "" || userInfo.phone == undefined) {

            wx.showModal({
                title: '温馨提示',
                content: '为了方便我们的客服联系您，请填写完整信息',
            })
            return
        }
        // wx.setStorageSync(KEY.IS_SIGN, true)
        // wx.showModal({
        //     title: '报名成功',
        //     content: '请预览我们近期的课程表，',
        // })
        // GP.setData({
        //     isSign:true
        // })
        API.Request({
          url: API.LITE_USER_SET_INFO,
          data: {
            "name": userInfo.name,
            "phone": userInfo.phone,
          },
          success:function(res){
            console.log(res)
            wx.showModal({
              title: '报名成功',
              content: '请预览我们近期的课程表，',
            })
          }
        })
    },
    reSign(){
        GP.setData({
            isSign: false
        })
    },

    onLoad: function (options) {
        GP = this

        GP.setData({ isSign: wx.getStorageSync(KEY.IS_SIGN) == true ? true :false})
        GP.setData({
          userInfo: wx.getStorageSync(KEY.USER_INFO)
        })
        GP.onInit()
    },

    inputName(e) {
        var _userInfo = GP.data.userInfo
        _userInfo.name = e.detail
        GP.setData({
            userInfo: _userInfo
        })
    },
    inputCompany(e) {
        var _userInfo = GP.data.userInfo
        _userInfo.company = e.detail
        GP.setData({
            userInfo: _userInfo
        })
    },
    inputPhone(e) {
        var _userInfo = GP.data.userInfo
        _userInfo.phone = e.detail
        GP.setData({
            userInfo: _userInfo
        })
    },


    /**
     *  进入渠道：
     * 1 、 文章进入，有点播
     * 2、 供求、花名册、会员，没有点播
     */
    onInit: function (options) {

        API.Request({
            url: API.LITE_COMPANY_GET_INFO,
            success: function (res) {
                console.log(res.data.company_dict)
                GP.setData({
                    companyInfo: res.data.company_dict
                })
            }
        })


        // API.Request({
        //     url: API.MEET_SIGN_GET_INFO,
        //     success: function (res) {
        //         console.log(res)
        //         GP.setData({
        //             userInfo: res.data.dict_attendee
        //         })
        //     }
        // })
        

        // 获取入场券信息
        // API.Request({
        //   url: API.ROOM_CHECK_TEACHER,
        //   success: function (res) {
        //     console.log(res)
        //     GP.setData({
        //       isTeacher: res.data.is_teacher
        //     })
        //   }
        // })
        
    },

    // 上传信息
    updateInfo(){
        var userInfo = GP.data.userInfo
        if (userInfo.name == "" || userInfo.company == "" || userInfo.phone == "") {
            var n = userInfo.name == "" ? "姓名  " : ""
            var c = userInfo.company =="" ? "企业名称  " : ""
            var p = userInfo.phone == "" ? "手机  " : ""
            wx.showModal({
                title: '温馨提示',
                content: '为了方便联系您，请填写：' +n+c+p ,
            }) 
            return 
        }
        // 上锁
        if ( GP.data.lock == true){
            wx.showModal({
                title: '温馨提示',
                content: '正在上传中，请别着急',
            })
            return 
        }
        GP.setData({
            lock:true,
        })
        API.Request({
            url: API.MEET_SIGN_SET_INFO,
            data: {
                name: userInfo.name,
                company: userInfo.company,
                phone: userInfo.phone,
            },
            success: function (res) {
                console.log(res)
                // GP.setData({
                //     userInfo: res.data.dict_attendee
                // })
            },
            complete:function(res){
                GP.setData({
                    lock: false,
                })
            },
        })
    },

    clickAddress() {

        wx.openLocation({
            latitude: GP.data.companyInfo.latitude,
            longitude: GP.data.companyInfo.longitude,
            // scale: 28
        })
    },

    clickPhone(){
        wx.makePhoneCall({
            phoneNumber: GP.data.companyInfo.phone,
        })
    },


})