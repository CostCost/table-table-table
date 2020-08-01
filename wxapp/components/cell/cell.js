// components/cell/cell.js
Component({
  relations: {
    '../cell-list/cell-list': {
      type: 'parent',
      linked: function(target) {
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
      },
      linkChanged: function(target) {
        // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
      },
      unlinked: function(target) {
        // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
      }
    },
    '../cell-content/cell-content': {
      type: 'descendant',
      linked: function(target) {
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
        this.updateCellContent(target);
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    full: {//全屏border，但左边距依然存在
      type: Boolean,
      value: false
    },
    clear: {//与full类似，但高度和边距都为0 优先级比full高
      type: Boolean,
      value: false,
    },
    paddingV: {
      type: String,
      value: '',
    },
    empty: {
      type: Boolean,
      value: false,
      observer(){
        this.updateCellContent();//触发更新cell-content
      }
    },
    clickable: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    $index: 0
  },

  lifetimes: {
    // attached(){
    //   this.updateCellContent();
    // }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 如果target为空，则更新全部的cell-content
    updateCellContent(target){
      if(target){
        target.setEmpty(this.data.empty);
        return;
      }
      var nodes = this.getRelationNodes('../cell-content/cell-content');
      nodes.forEach(node => {
        node.setEmpty(this.data.empty);
      });
    }
  }
})
