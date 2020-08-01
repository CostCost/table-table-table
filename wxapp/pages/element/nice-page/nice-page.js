// pages/element/nice-page/nice-page.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    background: {
      type: String,
      value: 'rgba(0,0,0,1)'
    },
    opacity: {
      type: Number,
      value: 1
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    navPaddingRight: 0,
    statusBarHeight: 0
  },

  lifetimes: {
    attached(){
      wx.getSystemInfo({
        success: (system)=>{
          let bbox = wx.getMenuButtonBoundingClientRect();
          let ios = system.system.toLocaleLowerCase().indexOf('ios') >= 0;

          this.setData({
            statusBarHeight: system.statusBarHeight,
            navPaddingRight: (system.windowWidth - bbox.right) + bbox.width,
            navHeight: ios ? 44 : 48
          });
        }
      });
    },
  }
})
