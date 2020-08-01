//index.js
import ElementService from '../../services/element';
import Ptable from '../../services/ptable';
import BaseBehavior from '../../behaviors/base';

Page({
  behaviors: [BaseBehavior],
  data: {
    category: '',
    showCatDialog: false,
    catBtnX: 2000,
    catBtnY: 2000,

    table: {},
    baseInfos: {},

    categoryOptions: [],
  },
  onReady: function () {
    // 周期表
    let table = Ptable.getLong();
    let baseInfos = ElementService.getAllBaseInfo();
    this.setData({
      table: table,
      baseInfos: baseInfos
    });

    // 设置按钮位置
    wx.getSystemInfo({
      success: (res)=>{
        this.setData({
          catBtnX: res.windowWidth - 64 + 'px',
          catBtnY: res.windowHeight - 64 + 'px'
        });
      }
    });
  },

  onShareAppMessage(){
    return {
      title: this.getShareTitle(),
      path: this.getSharePath()
    }
  },

  categoryChange(e){
    let category = e.detail.category;
    this.setData({
      category: category,
      showCatDialog: false
    });
  },

  closeCategory(){
    this.setData({
      showCatDialog: false
    });
  },

  onCategoryClick(){
    this.setData({
      showCatDialog: !this.data.showCatDialog
    });
  },
})
