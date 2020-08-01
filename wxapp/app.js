const ald = require('./utils/ald-stat.js');//阿拉丁

//app.js
App({
  onLaunch() {
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // });

    // 监听内存告警
    wx.onMemoryWarning(() => {
      // 内存告警
    });
  },
  // 主题色切换
  onThemeChange(res){
    // 处理主题切换
  },
})