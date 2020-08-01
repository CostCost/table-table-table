Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    colors: {},
  },

  lifetimes:{
    attached(){
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchMask() {
      this.triggerEvent('close');
    },

    itemClick(e){
      this.triggerEvent('type', {
        type: e.currentTarget.dataset.type
      });
    }
  }
})
