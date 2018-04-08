var JMessage = require('jmessage-wxapplet-sdk-1.4.0.min.js')
var RANDOM = require('random.js')
var MD5 = require('md5.js')
var appKey = "12101be04a3f9c65a1cd24b3"
var Key = "f803e0a4a08c48a31456b4ed"

module.exports = new (function () {
    var self = this;
    var app = null;
    var jim = null;
    var username = null;
    var password = null;
    var listenFn = null;
    this.init = function (_app, _username, _password,_listenFn) {
        app = _app;
        username = _username;
        password = _password;
        listenFn = _listenFn

        var JMessage = require('jmessage-sdk-web.1.4.0.min.js');
        // var JMessage = require('jmessage-wxapplet-sdk-1.4.0.min.js');
        jim = new JMessage({
          // debug: true
        });
        this.JIM = jim;
        this.gid = 10260372;
        this.across_user = 'test0011';
        this.msg_ids = [56562546, 57865421, 45875642, 14236589];
        this.msg_id = 451732948;
        this.minit(function () {
          // self.reg(username, password)
          self.login(function(){},function(){})
          self.listenMsg();
          console.log('初始化成功！');
        }, function (data) {
            console.log("11"+data);
        });
    };
    //极光im初始化
    this.minit = function (cb, cfb) {
        this.getauth(function (r) {
            jim.init(r).onSuccess(function () {
                self.login(cb, cfb);
           }).onFail(cfb);
        });
    };
    this.getauth = function (cb) {
      var timestamp = new Date().getTime()
      var _random = RANDOM.Get32()
      var signature = MD5.hex_md5("appkey=" + appKey + "&timestamp=" + timestamp + "&random_str=" + _random + "&key=" + Key + "")
      
      cb({
        "appkey": appKey,
        "random_str": _random,
        "signature": signature,
        "timestamp": timestamp,
        // "appkey": "4f7aef34fb361292c566a1cd",
        // "random_str": "404",
        // "signature": "7db047a67a9d7293850ac69d14cc82bf",
        // "timestamp": "1507882399401",
        // "flag": 0
      });
      //app.api.net.ajaxjson({}, function (r) {
      //    cb(r.data);
      //});
    };
    //注册
    this.reg = function (cb, cfb) {
        jim.register({
          'username': username,
          'password': password
        }).onSuccess(cb).onFail(function (data) {
          console.log(data)
            if (data.code == 882002) {
                cb();
            } else {
                cfb(data);
            }
        });
    };
    //登陆
    this.login = function (cb, cfb) {
      self.reg(
        function () {  //注册成功，直接登陆
          jim.login({
            'username': username,
            'password': password
          }).onSuccess(function(){
            cb();
            jim.getConversation().onSuccess(function (data) {
              console.log('conversiontoin:' + JSON.stringify(data));
            }).onFail(function (data) {
              console.log('error:' + JSON.stringify(data));
            });
          }).onFail(cfb);
        },
        cfb, //注册失败
      );
    };
    //监听事件
    this.listenMsg = function () {
      var self = this;
      listenFn()

      //断线事件 -- 监听重连
      jim.onDisconnect(function () {
        console.log('...on disconnect ');
        var task = setInterval(function () {
          if (jim.isConnect()) {
            clearInterval(task);
            self.minit(function () {
              self.login(function () { }, function () { })
              self.listenMsg();
              console.log('初始化成功！');
            }, function (data) {
              console.log("11" + data);
            });
          }
        }, 1000);
      });
    };



    this.sendSingleCustom = function (username, custom) {
        jim.sendSingleCustom({
            'target_username': username,
            'custom': custom,
            'need_receipt': true
        }).onSuccess(function (data) {
            console.log(data)
        }).onFail(function (data) {
            var re = that.data.logInfo + 'fail:' + JSON.stringify(data);
            that.setData({
                logInfo: re
            });
        });
    }
    
})();



      // jim.onMsgReceive(function (data) {
      //   var msg = data;
      //   var body = data.messages[0].content.msg_body;
      //   data = JSON.stringify(data);
      //   console.log('msg_receive:' + data);

      //   if (msg.messages[0].content.msg_type === 'image') {  //消息转发
      //     jim.sendSinglePic({
      //       'target_username': self.across_user,
      //       'target_nickname': '哈哈',
      //       'need_receipt': true,
      //       'msg_body': body
      //     }).onSuccess(function (data) {
      //       console.log('消息转发成功' + JSON.stringify(data));
      //     })
      //   }

      // });


      // jim.onEventNotification(function (data) {
      //   console.log('...event_receive: ' + JSON.stringify(data));

      // });

      // jim.onSyncConversation(function (data) { //离线消息同步监听
      //   console.log('...event_receive: ' + data);

      // });

      // jim.onUserInfUpdate(function (data) {
      //   console.log('...onUserInfUpdate : ' + JSON.stringify(data));

      // });

      // jim.onSyncEvent(function (data) {
      //   console.log('...onSyncEvent : ' + JSON.stringify(data));

      // });

      // jim.onMsgReceiptChange(function (data) {
      //   console.log('...onMsgReceiptChange : ' + JSON.stringify(data));


      // });

      // jim.onSyncMsgReceipt(function (data) {
      //   console.log('...onSyncMsgReceipt : ' + JSON.stringify(data));


      // });

      // jim.onMutiUnreadMsgUpdate(function (data) {
      //   console.log('...onConversationUpdate : ' + JSON.stringify(data));


      // });

      // jim.onTransMsgRec(function (data) {
      //   console.log('...onTransMsgRec : ' + JSON.stringify(data));

      // });