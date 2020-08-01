import ElementService from '../../services/element';
import BaseBehavior from '../../behaviors/base';
import DBIsotops from '../../database/isotops';

Page({
  behaviors: [BaseBehavior],

  data: {
    isotops: [],
    name: '',
    color: '',
  },

  onLoad: function (options) {
    let number = options.number || '1';
    let isotops = DBIsotops[number];
    let name = ElementService.getBaseInfo(number).name;


    wx.setNavigationBarTitle({
      title: `${name} - 同位素`
    });

    this.setData({
      name: name,
      color: ElementService.getCategoryColor(number),
      isotops: isotops
    });
  },

  onShow: function () {

  },

  onShareAppMessage(){
    return {
      title: '嗨，快来看看这个同位素',
    };
  }
})