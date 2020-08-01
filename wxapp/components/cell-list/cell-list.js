import BaseBehavior from '../../behaviors/base';

// components/cell-list/cell-list.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  behaviors: [BaseBehavior],
  relations: {
    '../cell/cell': {
      type: 'child',
      linked: function(target) {
        this.updateCellIndex();
      },
      linkChanged: function(target) {
        this.updateCellIndex();
      },
      unlinked: function(target) {
        this.updateCellIndex();
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    showHeader: {
      type: Boolean,
      value: true
    },
    headerIcon: {
      type: String,
      value: ''
    },
    headerText: {
      type: String,
      value: ''
    }
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
    updateCellIndex(){
      let cells =  this.getRelationNodes('../cell/cell') || [];
      for(let i=0; i<cells.length; i++){
        let cell = cells[i];
        cell.setData({
          $index: i
        });
      }
    }
  },

  lifetimes: {
    ready(){
      this.updateCellIndex();
    }
  }
})
