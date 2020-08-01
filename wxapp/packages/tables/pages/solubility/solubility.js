import {TableData, NameData} from './data';
import BaseBehavior from '../../../../behaviors/base';

Page({
  behaviors: [BaseBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    tableData: TableData,
    nameData: NameData,
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  typeChange(e){
    let type = e.currentTarget.dataset.type;
    if(type === this.data.type){
      return;
    }
    this.setData({
      type
    });
  },

  onShareAppMessage: function () {
    return {
      title: this.getShareTitle(),
      path: this.getSharePath()
    }
  }
})