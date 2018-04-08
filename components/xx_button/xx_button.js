// components/xx_cover_news/xx_cover_news.js
Component({
  /**
   * 组件的属性列表
   */
    properties: {
        icon: {
            type: String,
            value: "",
        },
        title: {
            type: String,
            value: "",
        },
        color: {
            type: String,
            value: "#0087ce",
        },
        colorhover: {
            type: String,
            value: "#0053a5",
        },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
      // 改变
    _change(newVal, oldVal) {
    },

    click(e) {
        console.log(231)
        this.triggerEvent('click');
    },
  }
})
