import * as Category from '../../../enums/category';

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
      // 分类options
      let colors = Category.dark
      this.setData({
        colors
      })
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
      this.triggerEvent('category', {
        category: e.currentTarget.dataset.category
      });
    }
  }
})
