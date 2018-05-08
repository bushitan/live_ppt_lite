
var KEY = require('../../utils/key.js');
var QINIU = require('../../utils/qiniu.js');

var teacher = "live_app_3"
var student = 'live_pvp_user_5'


module.exports = new (function() {
    var that = this
    var APP = null
    var GP = null
    var API = null
    var JMessage = null
    this.Init = function (_APP, _GP, _API, _JMessage){
        APP = _APP
        GP = _GP
        API = _API
        JMessage = _JMessage
    }

    this.uploadFile = function (tag_id, tempFilePaths){
        console.log("上传临时文件到文件夹", tag_id, tempFilePaths)

        // QINIU.UploadImage(GP)
        QINIU.UploadFile(tag_id, tempFilePaths, uploadSuccess)
    }

    function uploadSuccess(res) {
        wx.showToast({
            title: '点击标签刷新',
            icon:"success"
        })
        console.log(res)
        // var data = JSON.parse(res.data);
        // var tag_id = data.image_dict.tag_id
        // var url = data.image_dict.url

    }
    function uploadFail(res) {
        console.log(res)
    }
})