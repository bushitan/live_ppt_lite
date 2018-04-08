
Component({
  /**
   * 组件的属性列表
   */
    properties: {

        
        pricename: {
            type: String,
            value: "",
        },
        name: {
            type: String,
            value: "名称",
        },
      
        index: {
            type: Number,
            value: 0,
        },
        list:{
            type:Array,
            value:[],
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
       

        //   click(e) {     
        //       this.triggerEvent('click', e.currentTarget.dataset.index);
        //   },
        input(e) {
            // console.log(e)
            this.triggerEvent('input', e.detail.value);
        },        
        change(e){
            console.log(e)
            this.setData({
                index: e.detail.value
            })
            this.triggerEvent('change', e.detail.value);
        }
    }
})
