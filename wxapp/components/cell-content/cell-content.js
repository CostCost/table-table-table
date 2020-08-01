import BaseBehavior from '../../behaviors/base';

Component({
    behaviors: [BaseBehavior],
    relations: {
      '../cell/cell': {
        type: 'ancestor',
        linked: function(target) {
        },
        linkChanged: function(target) {
        },
        unlinked: function(target) {
        }
      }
    },
    properties: {
        customStyle: {
            type: String,
            value: ''
        }
    },
    data: {
        empty: false,
    },
    methods: {
        setEmpty(empty){
            if(this.data.empty != empty){
                this.setData({
                    empty: empty
                });
            }
        }
    },
})