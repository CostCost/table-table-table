// components/alet/alet.js
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
    realShow: true,
    step: '0',
  },

  lifetimes: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeStep(e){
      let step = e.currentTarget.dataset.step;
      this.setData({
        step: step
      });
      wx.vibrateShort();

      if(step == '3'){
        setTimeout(()=>{
          this.setData({
            realShow: false
          })
        }, 4000);
      }
    },
  },
})
