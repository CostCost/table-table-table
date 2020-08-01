// pages/element/oxidation/oxidation.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:{
      type: String,
      value: '-,-,-,-,1,0,1,-,-,-,-,-,-,-,-',
      observer(value){
        this.updateData();
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    line1: [],
    line2: []
  },

  lifetimes:{
    attached(){
      this.updateData();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateData(){
      let value = this.data.value;
      let list = value.split(',');

      let line1 = [list[0], list[1], list[2], list[3], list[4], list[5]].reverse();
      let line2 = [list[6], list[7], list[8], list[9], list[10], list[11], list[12], list[13], list[14]];

      line1 = line1.map(l => l ? l.trim().replace('-', '') : '-');
      line2 = line2.map(l => l ? l.trim().replace('-', '') : '-');

      this.setData({
        line1: line1,
        line2: line2
      });
    }
  }
})
