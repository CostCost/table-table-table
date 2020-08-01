// components/drop-menu/drop-menu.js
Component({
  externalClasses: ['custom-class'],
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  relations: {
    '../drop-menu-item/drop-menu-item': {
      type: 'child',
      linked: function(target) {
      },
      linkChanged: function(target) {
      },
      unlinked: function(target) {
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowDropMenu: false,
    layout: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async showDropMenu(e){
      let pos = e.detail || {x:0, y:0};
      this.setData({
        isShowDropMenu: true,
        layout: `left:${pos.x}px;top:${pos.y}px;`
      });

      let bbox = await this.getBbox();
      
      let layout = {};
      if(bbox.bottom < 0){
        console.log('y超出屏幕!');
        layout.bottom = 0;
      }else{
        layout.top = pos.y;
      }
      
      if(bbox.right < 0){
        console.log('x超出屏幕!');
        layout.right = 0;
      }else{
        layout.left = pos.x;
      }

      let layoutStr = '';
      if(layout.top != null) layoutStr += `top:${layout.top}px;`;
      if(layout.right != null) layoutStr += `right:${layout.right}px;`;
      if(layout.bottom != null) layoutStr += `bottom:${layout.bottom}px;`;
      if(layout.left != null) layoutStr += `left:${layout.left}px;`;

      this.setData({
        layout: layoutStr
      })
    },
    hideDropMenu(){
      this.setData({
        isShowDropMenu: false
      });
    },
    itemClick({name, value}){
      this.triggerEvent('selected', {
        name: name,
        value: value
      });
      this.hideDropMenu();
    },
    async getBbox(){
      return new Promise(next => {
        wx.nextTick(() => {
          let system = wx.getSystemInfoSync();
          let query = this.createSelectorQuery();
          query.select('.drop-menu').boundingClientRect().exec((res)=>{
            let bb = res[0];
            next({
              left: bb.left,
              right: system.windowWidth - bb.right,//- bb.left - bb.width,
              top: bb.top,
              bottom: system.windowHeight - bb.top,//- bb.top - bb.height

              width: bb.width,
              height: bb.height
            });
          });
        });
      });
    },
  },
})
