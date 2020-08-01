const DefaultConfig = {
    "enable_3rd_oas": false,//开启第三方公众号
    "show_qa_ratio": 0,//趣味问答显示第三方公众号几率
    "oas": []//公众号
};

class ConfigService {
    constructor() {
        this._config = null;
    }

    async getConfig() {
        return new Promise(next => {
            if(this._config){
                next(this._config);
                return;
            }

            wx.request({
                url: 'https://wxapp-pt.oss-cn-beijing.aliyuncs.com/config.json',
                success: (res) => {
                    if (res.data) {
                        next(res.data);
                    }else{
                        next(DefaultConfig);
                    }
                },
                fail: ()=>{
                    next(DefaultConfig);
                }
            });
        });
    }
}

export default new ConfigService();