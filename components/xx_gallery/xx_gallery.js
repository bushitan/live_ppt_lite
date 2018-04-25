// components/xx_cover_news/xx_cover_news.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
    },
    title: {
        type: String,
        value: "标记",
    },
    color: {
        type: String,
        value: "#000",
    },

    showAdd: {
        type: Boolean,
        value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
      list: [
      { image_url: 'http://img.12xiong.top/emoji_default.gif' },
      { image_url: 'http://qiniu.308308.com/hx_245_2018_01_18_08_47_14.jpg' },
      { image_url: 'http://qiniu.308308.com/hx_245_2018_01_18_08_47_14.jpg' },
      { image_url: 'http://qiniu.308308.com/hx_245_2018_01_18_08_47_14.jpg' },
      { image_url: 'http://qiniu.308308.com/hx_245_2018_01_18_08_47_14.jpg' },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
      // 改变
    _change(newVal, oldVal) {
    },
    clickEmoji(e) {
      var image_url = e.currentTarget.dataset.image_url
      this.triggerEvent('click', image_url);
    },

    long() {
        this.triggerEvent('long');
    },

    clickBtn(e) {
      var index = e.currentTarget.dataset.index
      
      this.triggerEvent('choice', this.data.list[index].url);
    },

    //增加图片
    clickAdd(e) {
        this.triggerEvent('add');
    },
  }
})
