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
        icon: {
            type: String,
            value: "../../images/ic_action_add.png",
        },
        width: {
            type: String,
            value: "750rpx",
        },
        height: {
            type: String,
            value: "423rpx",
        },
        tagList: {
            type: Array,
            value: [],
        },
        
  },

  /**
   * 组件的初始数据
   */
  data: {
      tagIndex:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
      // 改变
    // _change(newVal, oldVal) {
        // console.log(newVal, oldVal )
        // console.log(this.data.list)
    // },

    /**
     * return: 点击列表的index
     */
      click(e) {
          wx.previewImage({
              urls: [e.currentTarget.dataset.src],
          })
          // this.triggerEvent('click', temp);
      },
    //   clickTag(e) {
    //       this.triggerEvent('clickTag', temp);
    //   },

      bindPickerChange(e){
          var select= {
              "tagIndex": e.detail.value,
              "url": e.currentTarget.dataset.src,
          }
          console.log(e)
          this.triggerEvent('choiceTag', select);
      },
  }
})
