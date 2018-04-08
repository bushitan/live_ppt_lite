// components/xx_cover_news/xx_cover_news.js

var CLEAR = 0
var DRAW_LINE = 1
var TOP_TOUCH_STEP = 80 //单次绘画最高步数
Component({
  /**
   * 组件的属性列表
   */
    properties: {
        width: {
            type: String,
            value: "100%",
        },
        height: {
            type: String,
            value: "400rpx",
        },
        drawLine:{
            type: Object,
            value: {},
            observer:"addLine",
        },
        // 是否显示工具栏
        tool: {
            type: Boolean,
            value: true,
        },
        
        bg: {
          type: String,
          value: "",
          // value: "../../images/live_bg.jpg",
          // value: "../../images/hotapp_01_03.png",
          
        },
  },

  /**
   * 组件的初始数据
   */
  data: {
      pen: 3, //画笔粗细默认值
      color: '#cc0033' //画笔颜色默认值
  },
  /**
   * 组件的方法列表
   */
  methods: {
      startX: 0, //保存X坐标轴变量
      startY: 0, //保存X坐标轴变量
      isClear: false, //是否启用橡皮擦标记
      
      //手指触摸动作开始
      touchStart: function (e) {
          if (this.data.tool == false)
            return
          //得到触摸点的坐标
          this.startX = e.changedTouches[0].x
          this.startY = e.changedTouches[0].y
          this.posList = [{ "x": parseInt(this.startX), "y": parseInt(this.startY )}] //记录数组
          this.context = wx.createCanvasContext("myCanvas",this)

          if (this.isClear) { //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
              this.context.setStrokeStyle('#F8F8F8') //设置线条样式 此处设置为画布的背景颜色  橡皮擦原理就是：利用擦过的地方被填充为画布的背景颜色一致 从而达到橡皮擦的效果 
              this.context.setLineCap('round') //设置线条端点的样式
              this.context.setLineJoin('round') //设置两线相交处的样式
              this.context.setLineWidth(20) //设置线条宽度
              this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
              this.context.beginPath() //开始一个路径 
              this.context.arc(this.startX, this.startY, 5, 0, 2 * Math.PI, true);  //添加一个弧形路径到当前路径，顺时针绘制  这里总共画了360度  也就是一个圆形 
              this.context.fill();  //对当前路径进行填充
              this.context.restore();  //恢复之前保存过的坐标轴的缩放、旋转、平移信息
          } else {
              this.context.setStrokeStyle(this.data.color)
              this.context.setLineWidth(this.data.pen)
              this.context.setLineCap('round') // 让线条圆润 
              this.context.beginPath()

          }
      },
      //手指触摸后移动
      touchMove: function (e) {

          if (this.data.tool == false)
              return
          var startX1 = parseInt(e.changedTouches[0].x)
          var startY1 = parseInt( e.changedTouches[0].y)

          if (this.posList.length > TOP_TOUCH_STEP)
            return
          this.posList.push({ "x": startX1, "y": startY1 })
          if (this.isClear) { //判断是否启用的橡皮擦功能  ture表示清除  false表示画画

              this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
              this.context.moveTo(this.startX, this.startY);  //把路径移动到画布中的指定点，但不创建线条
              this.context.lineTo(startX1, startY1);  //添加一个新点，然后在画布中创建从该点到最后指定点的线条
              this.context.stroke();  //对当前路径进行描边
              this.context.restore()  //恢复之前保存过的坐标轴的缩放、旋转、平移信息

              this.startX = startX1;
              this.startY = startY1;

          } else {
              this.context.moveTo(this.startX, this.startY)
              this.context.lineTo(startX1, startY1)
              this.context.stroke()

              this.startX = startX1;
              this.startY = startY1;

          }
          //画，并且不擦除原来的记录
          this.context.draw(true)
      },
        //手指触摸动作结束
      touchEnd: function () {
          if (this.data.tool == false)
              return
            //   this.context.draw()
            // console.log(this.posList)
            // this.paintByPosList(this.posList)
          if (this.posList.length >= TOP_TOUCH_STEP )
            wx.showModal({
              title: '温馨提示',
              content: '这一笔太长，没墨水了T_T，请画短一点',
              showCancel:false,
              confirmText:"知道了",
            })
          var painterData = {
              style: DRAW_LINE,
              color: this.data.color,
              width: this.data.pen,
              posList:this.posList
          }
          this.triggerEvent('complete', painterData);
        },

        addLine(_new,_old){
            // console.log(_new)
            if(_new == null || _new == undefined || _new == {})
                return 
            if (_new.style == CLEAR)  //清除屏幕
                this.clearCanvas()
            else    //画线
                this.paintByPosList( 
                    _new.color,
                    _new.width,
                    _new.posList
                )
        },
        paintByPosList(color,width,posList) {

            this.context = wx.createCanvasContext("myCanvas", this)
            // this.context.setStrokeStyle(this.data.color)
            this.context.setStrokeStyle(color)
            this.context.setLineWidth(width)
            this.context.setLineCap('round') // 让线条圆润 
            this.context.beginPath()
            
            for (var i = 0; i < posList.length-1;i++){
                this.context.moveTo(posList[i].x, posList[i].y)
                this.context.lineTo(posList[i+1].x, posList[i+1].y)
                this.context.stroke()
            }

            this.context.draw(true)

        },


        //启动橡皮擦方法
        clearCanvas: function () {
            this.context = wx.createCanvasContext("myCanvas", this)
            this.context.clearRect(0, 0, 1000, 1000)
            this.context.draw()
        },
        //启动橡皮擦方法
        clearCanvasEvent: function () {
            this.clearCanvas()
            this.triggerEvent(
                'clear', 
                { style: CLEAR}
            );
        },
      penSelect: function (e) { //更改画笔大小的方法
        //   console.log(e.currentTarget);
          this.setData({ pen: parseInt(e.currentTarget.dataset.param) });
          this.isClear = false;
      },
      colorSelect: function (e) { //更改画笔颜色的方法
        //   console.log(e.currentTarget);
          this.setData({ color: e.currentTarget.dataset.param });
          this.isClear = false;
      }

  }
})
