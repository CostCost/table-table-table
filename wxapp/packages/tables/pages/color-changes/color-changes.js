import BaseBehavior from '../../../../behaviors/base';
// packages/tables/pages/color-changes/color-changes.js
Page({
  behaviors: [BaseBehavior],
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onChange({
      detail: {
        current: 0
      }
    })
  },

  onChange(e){
    let idx = e.detail.current;
    let names = ['石蕊', '酚酞', '甲基橙'];

    wx.setNavigationBarTitle({
      title: names[idx]
    });
  },

  onShareAppMessage: function () {
    return {
      title: this.getShareTitle(),
      path: this.getSharePath()
    }
  }
})