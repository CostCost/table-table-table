Component({
  /**
   * 组件的初始数据
   */
  data: {
    realShow: false,
    step: '0',

    wxid: 'wilhantian',

    showCloseBtn: false,//显示关闭按钮
  },

  lifetimes: {
    async ready(){
      await this._setUse();//记录使用时间

      if(await this._isAllwaysClose()){
        // console.log('永久关闭了')
        return;
      }

      let useDay = await this._getUseDay();
      if(useDay < 3){
        // console.log('使用使用天数小于3天');
        return;
      }

      let showTime = await this._getNextTime();
      let nowTime = Date.now();
      if(showTime && nowTime < showTime){//当前时间大于展示时间
        // console.log('未到展示时间');
        return;
      }

      // 允许展示
      this.setData({
        realShow: true
      });   
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeStep(e){
      let step = e.currentTarget.dataset.step;
      this.setData({
        step: step
      });
      wx.vibrateShort();

      if(step == '3'){
        setTimeout(()=>{
          this.setData({
            realShow: false
          })
        }, 4000);
      }
    },

    //下次再说
    async nextTime(){
      this.setData({
        realShow: false
      });

      // 设置下次开启时间
      await this._setNextTime();
    },

    //复制
    copyId(){
      wx.vibrateShort();
      wx.setClipboardData({
        data: this.data.wxid
      });

      // N秒后展示关闭按钮
      setTimeout(()=>{
        this.setData({
          showCloseBtn: true
        })
      }, 2000);
    },
    
    //永久关闭
    async close(){
      wx.vibrateShort();
      
      this.setData({
        realShow: false
      });
      // 设置为永久关闭
      await this._setAllwaysClose();
    },

    // 获取使用天数
    async _getUseDay(){
      return new Promise(async next => {
        let data = await this._getUse();
        if(!data){
          next(0);
          return;
        }
        next( Object.keys(data).length );
      });
    },

    // 获取今天使用数据
    async _getUse(){
      return new Promise(next => {
        wx.getStorage({
          key: '_use_day',
          success: (res)=>{
            let data = res.data;
            next(data);
          },
          fail: ()=>{
            next(null);
          }
        })
      });
    },

    // 保存今天使用数据
    async _setUse(){
      return new Promise(async next => {
        let data = await this._getUse();
        if(!data){
          data = {};
        }
        let date = new Date();
        let today = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate();

        data[today] = true;
        wx.setStorage({
          key: '_use_day',
          data: data,
          complete: ()=>{
            next(true);
          }
        });
      });
    },

    // 保存下次展示时间戳
    async _setNextTime(){
      return new Promise((next)=>{
        let nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);//明天

        wx.setStorage({
          key: '_next_show_seed_time',
          data: nextDate.getTime(),
          complete: ()=>{
            next(true);
          }
        });
      });
    },

    // 获取展示时间戳
    async _getNextTime(){
      return new Promise((next)=>{
        wx.getStorage({
          key: '_next_show_seed_time',
          success: (res)=>{
            let data = res.data;
            next(data);
          },
          fail: ()=>{
            next(null);
          }
        });
      });
    },

    // 保存永久关闭
    async _setAllwaysClose(){
      return new Promise((next)=>{
        wx.setStorage({
          key: '_next_allways_close_seed',
          data: true,
          complete: ()=>{
            next(true);
          }
        });
      });
    },

    // 是否永久关闭
    async _isAllwaysClose(){
      return new Promise((next)=>{
        wx.getStorage({
          key: '_next_allways_close_seed',
          success: (res)=>{
            let data = res.data;
            next(data);
          },
          fail: ()=>{
            next(false);
          }
        });
      });
    },
  },
})
