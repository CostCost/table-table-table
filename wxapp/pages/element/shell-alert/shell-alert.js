// pages/element/shell-alert/shell-alert.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    eleImage: {
      type: String,
      value: ''
    },
    electronConfig: {
      type: Array,
      value: []
    },
    electronShellText: {
      type: String,
      value: '',
      observer(){
        this.updateShellText();
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shellText: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchMask(){
      
    },

    updateShellText(){
      if(!this.data.electronShellText){
        this.setData({
          shellText: ''
        });
      }

      let shellText = this.data.electronShellText.split(' ')
        .map(t => {
          let k = t[0];
          let n = t.substr(1);
          return `${k}<sup><small>${n}<small></sup>`;
        })
        .join(' ');

      this.setData({
        shellText: shellText
      })
    }
  }
})
