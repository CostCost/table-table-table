import BaseBehavior from '../../behaviors/base';
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

  },

  clickImage(){
    wx.previewImage({
      urls: ['/assets/admire.jpg']
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(){
    return {
      title: this.getShareTitle(),
      path: this.getSharePath(),
      imageUrl: this.getShareImage()
    }
  },
})