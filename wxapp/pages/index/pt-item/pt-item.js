import ElementService from '../../../services/element';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    number: {
      type: String | Number,
      value: 0
    },
    activeCategory: {//高亮分类，如果和当前分类一直，那么保持高亮
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    color: '',
    group: false,

    leftSymbol: '-',
    rightSymbol: '-',

    symbol: '-',
    name: '-',
    radioactive: false,
    deactive: false,//不活跃
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  },

  observers: {
    'number,activeCategory': function(){
      let number = this.data.number;
      let group = number && number.indexOf('-') > 0;

      if(!group){//正常
        let baseInfo = ElementService.getBaseInfo(number);
        this.setData({
          group: false,
          symbol: baseInfo.symbol,
          name: baseInfo.name,
          color: ElementService.getCategoryColor(number),
          deactive: this.data.activeCategory && baseInfo.category != this.data.activeCategory,
          radioactive: baseInfo.radioactive == '+'
        });
      }else{//组
        let leftNum = number.split('-')[0];
        let rightNum = number.split('-')[1];
        this.setData({
          group: true,
          leftSymbol: ElementService.getBaseInfo(leftNum).symbol,
          rightSymbol: ElementService.getBaseInfo(rightNum).symbol,
        });
      }
    }
  }
})
