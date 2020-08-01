const ShareMsgList = [
    {
        title: '嗨, 我建议你尝试一个很酷的化学小程序',
        path: '/pages/index/index',
        imageUrl: 'https://wxapp-pt.oss-cn-beijing.aliyuncs.com/share/share_1.png'
    },
    {
        title: '有哪些关于化学元素的冷知识？',
        path: '/pages/index/index',
        imageUrl: 'https://wxapp-pt.oss-cn-beijing.aliyuncs.com/share/share_2.png'
    },
    {
        title: '来自《元素周期表 专业版》',
        path: '/pages/index/index',
        imageUrl: 'https://wxapp-pt.oss-cn-beijing.aliyuncs.com/share/share_3.png'
    },
];
const ShareTitleList = [
    '嗨, 我建议你尝试一个很酷的化学小程序',
    '有哪些关于化学元素的冷知识？',
    '来自《元素周期表 专业版》',
];
const ShareImageList = [
    'https://wxapp-pt.oss-cn-beijing.aliyuncs.com/share/share_1.png',
    'https://wxapp-pt.oss-cn-beijing.aliyuncs.com/share/share_2.png',
    'https://wxapp-pt.oss-cn-beijing.aliyuncs.com/share/share_3.png'
];

export default Behavior({
    data: {
        _isDark: true,
        _bottom: '0rpx'
    },
    attached(){
        // TODO 读取dark全局变量 赋值
        // this._setDark(!this.data._isDark);
    },
    methods: {
        onLoad(){
            wx.getSystemInfo({
              success: (res) =>{
                let bottom = res.screenHeight - res.safeArea;
                this.setData({
                  _bottom: bottom + 'rpx'
                });
              },
            })
        },
        _setDark(isDark){
            this.setData({
                _isDark: isDark
            });
        },
        getNormalShareAppMessage(){
            return ShareMsgList.sort(()=>{
                return Math.random() < 0.5 ? -1 : 1;
            })[0];
        },
        getShareTitle(){
            return ShareTitleList.sort(()=>{
                return Math.random() < 0.5 ? -1 : 1;
            })[0];
        },
        getSharePath(){
            return '/pages/index/index';
        },
        getShareImage(){
            return ShareImageList.sort(()=>{
                return Math.random() < 0.5 ? -1 : 1;
            })[0];
        }
    }
})