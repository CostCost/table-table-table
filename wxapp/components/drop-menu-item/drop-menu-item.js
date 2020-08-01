Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  relations: {
    '../drop-menu/drop-menu': {
      type: 'parent',
      linked: function(target) {
      },
      linkChanged: function(target) {
      },
      unlinked: function(target) {
      }
    }
  },

  properties: {
    name: {
      type: String,
      value: ''
    },
    value: {
      type: String,
      value: ''
    }
  },

  data: {

  },

  methods: {
    itemClick(e){
      let cells =  this.getRelationNodes('../drop-menu/drop-menu') || [];
      cells[0] && cells[0].itemClick({
        name: this.data.name,
        value: this.data.value
      });
    }
  }
})
