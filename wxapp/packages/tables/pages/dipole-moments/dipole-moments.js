import data from './data';
import BaseBehavior from '../../../../behaviors/base';

Page({
  behaviors: [BaseBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    list: data
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onShareAppMessage: function () {
    return {
      title: this.getShareTitle(),
      path: this.getSharePath()
    }
  }
})