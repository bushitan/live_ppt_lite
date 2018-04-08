
Component({
  /**
   * 组件的属性列表
   */
    properties: {
        image: {
            type: String,
            value: "../../images/hotapp_01_03.png",
        },
        top: {
            type: String,
            value: "0px",
        },
        left: {
            type: String,
            value: "0px",
        },

        endtop: {
            type: String,
            value: "300px",
        },
        endleft: {
            type: String,
            value: "250px",
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
            this.onClick() 
            this.triggerEvent('click', e.currentTarget.dataset.index);
        },
     
        onClick(){
            this.setData({
                top: this.data.endtop,
                left: this.data.endleft,
                opacity:0,
            })
        }
    }
})
