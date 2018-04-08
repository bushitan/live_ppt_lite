// components/xx_cover_news/xx_cover_news.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      list: {
          type: Array,
          value: [],
          //   observer: '_changeLevel',
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
      click(e) {
          
          this.triggerEvent('click', this.data.list[this.data.selectIndex]);
      },
  }
})
