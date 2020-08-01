import BaseBehavior from '../../behaviors/base';
import ConfigService from '../../services/config';

Page({
  behaviors: [BaseBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    version: '',
    oa: null,//公众号推荐
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let canUseVersion = wx.canIUse('getAccountInfoSync');
    if(canUseVersion){
      let info = wx.getAccountInfoSync();
      this.setData({
        version: info.miniProgram && info.miniProgram.version
      });
    }

    let config = await ConfigService.getConfig();
    if(config.enable_3rd_oas){
      let oa = (config.oas || []).sort(()=> { return Math.random() < 0.5 ? 1 : -1 })[0];
      this.setData({
        oa: oa || null
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(){
    return {
      title: this.getShareTitle(),
      path: this.getSharePath()
    }
  },

  /**
   * 公众号点击
   */
  onOaClick(){
    if(!this.data.oa){
      return;
    }
    
    wx.setClipboardData({
      data: this.data.oa.oaid
    })
  }
})