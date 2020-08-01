import ConfigService from '../../../../services/config';
import Poster from '../../miniprogram_dist/poster/poster';
import Questions from './questions';

const Q_SIZE = 5;

// packages/enjoys/pages/character/character.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    msgList: [
    ],
    intoViewId: '',//最后一个ID

    options: null,//当前选项
    answerRecords: [],//答题记录

    posterConfig: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._curQuestion = null;//当前问题
    this._questions = this.createQuestions();//当前所有问题
    this._answerHandler = null;//问题选项的Promise回调
    this._buttons = {};//按钮回调
    this._ID = 0;//ID累加
    this._rightCnt = 0;//正确数量
    this._createShareImageHandler = null;//分享图创建回调
    this._shareImg = null;//当前分享图 可能没有

    this.start();
  },

  async start() {
    await this.wait(1200);
    await this.addMsg('嗨！同学您好');
    await this.addMsg('欢迎进入趣味化学考场');

    let userInfo = await this.getUserInfo();
    if(!userInfo){
      await this.addMsg('本考场是实名制，需要获得您授权并取得昵称和头像', '', false, {
        text: '授权',
        type: 'getUserInfo',
        callback: async (e)=>{
          let userInfo = await this.getUserInfo();
          if(userInfo){
            this.setData({
              msgList: [],
              userInfo: userInfo
            });
            this.step1();
          }
        },
      });
    }else{
      this.setData({
        userInfo: userInfo
      });
      this.step1();
    }
  },

  async step1(){
    await this.addMsg(`稍后将随机抽取 ${Q_SIZE} 道题目让您解答`);
    await this.addMsg('我们的题库来源于互联网，准备好了吗？', '', false, {
      text: '开始考试',
      callback: async ()=>{
        // 开始
        while (true) {
          if (!await this.nextQuestion()) {
            break;
          }
        }

        await this.addMsg('正在为您批卷');
        await this.wait(2000);
        await this.addMsg(`批卷完成，共有${Q_SIZE}道题, 您答对了${this._rightCnt}道题，`);
        await this.addMsg(`您的成绩为${this._rightCnt / Q_SIZE * 150}分`);

        if(this._rightCnt > 3){//分数很高
          await this.wait(1000);
          wx.vibrateShort();
          await this.addMsg('等等!');
          await this.wait(1500);
          await this.addMsg('哇哦！ 您此次考试竟意外获得了证书');
          let shareImg = await this.createShareImage(this.data.userInfo.nickName);
          this._shareImg = shareImg;
          wx.vibrateShort();
          await this.addImage(shareImg, 200, 150);
          await this.addMsg('点击上方图片，可以预览保存您的证书');
        }else{
          await this.wait(1000);
          await this.addMsg('此次考试结束')
        }
        
        await this.wait(1000);
        await this.addMsg('如果您觉得还不错，可以考考你的朋友', '', false, {
          text: '邀请朋友来考场',
          type: 'share'
        });

        await this.wait(1600);

        // 几率显示合作伙伴公众号
        let config = await ConfigService.getConfig();
        let oa = null;
        if(config.enable_3rd_oas){//判断是否开启
          oa = (config.oas || []).sort(()=> { return Math.random() < 0.5 ? 1 : -1 })[0];
        }

        if(oa && config.show_qa_ratio > Math.random()){
          await this.addMsg(oa.oa_desc, '', false, {
            text: '复制公众号',
            callback: ()=>{
              wx.setClipboardData({
                data: oa.oaid
              })
            }
          });
        }else{
          // 回到主页
          await this.addMsg('我们是「元素周期表 专业版」，专注于化学工具类小程序', '', false, {
            text: '返回主页',
            callback: ()=>{
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          });
        }

      },
      once: true
    });
  },

  createQuestions() {
    return Questions.sort(() => {
      return Math.random() < 0.5 ? 1 : -1;
    }).slice(0, Q_SIZE).map((q, index) => {
      return {
        ...q,
        index: index
      }
    });
  },

  async nextQuestion() {
    if (this._curQuestion == null) {
      this._curQuestion = this._questions[0];
    } else {
      this._curQuestion = this._questions[this._curQuestion.index + 1];
    }
    if (this._curQuestion == null) {
      console.log('题目全部完成', this.data.answerRecords);
      return Promise.resolve(false);
    }

    return new Promise(async next => {
      await this.addMsg(this._curQuestion.title, '第' + (this._curQuestion.index + 1) + '题');
      this._answerHandler = next;
      this.setData({
        options: this._curQuestion.options,
        intoViewId: 'bottomView'
      });
    });
  },

  async onAnswerItemClick(e) {
    wx.vibrateShort();
    let index = e.currentTarget.dataset.index;

    // 记录答案 + 清空选项
    this.data.answerRecords.push(index);
    this.setData({
      answerRecords: this.data.answerRecords,
      options: null,
    });

    // 添加回答
    await this.addMsg(this._curQuestion.options[index], '', true);

    // 添加结果
    if (this._curQuestion.answer == index) {//正确
      this._rightCnt++;
    } else {
      //UNUSE
    }

    // 完成题目
    this._answerHandler(true);
  },


  async addMsg(text, mark, self = false, button = {text:null, callback:null, once:false, type:''}) {
    return new Promise(next => {
      this.data.msgList.push({
        text: text,
        mark: mark,
        self: self,
        button: button,
        id: ++this._ID
      });
      this._buttons[this._ID] = button;
      this.setData({
        msgList: this.data.msgList,
        intoViewId: 'msgItem' + (this.data.msgList.length - 1)
      });

      setTimeout(() => {
        next();
      }, 900);
    })
  },

  async addImage(image, width = 150, height = 150) {
    return new Promise(next => {
      this.data.msgList.push({
        image: image,
        width: width,
        height: height
      });
      this.setData({
        msgList: this.data.msgList,
        intoViewId: 'msgItem' + (this.data.msgList.length - 1)
      });

      setTimeout(() => {
        next();
      }, 900);
    })
  },

  buttonClicked(e) {
    let id = e.currentTarget.dataset.tag;
    let button = this._buttons[id];
    let msg = this.getMsgById(id);
    let once = button.once;

    if(button.type){//open-type不为空，需要走对应的回调
      return;
    }

    if (msg.disable) {
      return;
    }

    let callback = button.callback;
    if (callback) {
      callback();
    }

    if (once) {
      this.getMsgById(id).disable = true;
      this.setData({
        msgList: this.data.msgList
      });
    }

    wx.vibrateShort();
  },

  buttonUserInfo(e){
    let id = e.currentTarget.dataset.tag;
    let button = this._buttons[id];
    let msg = this.getMsgById(id);
    let once = button.once;

    if (msg.disable) {
      return;
    }

    let callback = button.callback;
    if (callback) {
      callback();
    }

    if (once) {
      this.getMsgById(id).disable = true;
      this.setData({
        msgList: this.data.msgList
      });
    }

    wx.vibrateShort();
  },

  getMsgById(id) {
    return this.data.msgList.find(msg => msg.id == id)
  },

  async createShareImage(name){
    let posterConfig = {
      width: 1000,
      height: 701,
      backgroundColor: '#000',
      pixelRatio: 2,
      preload: true,
      images: [
        {
          x: 0,
          y: 0,
          url: '/packages/enjoys/assets/certificate-null.png',
          width: 1000,
          height: 701,
          zIndex: 0
        },
        {
          x: 1000 / 2 - 84 / 2,
          y: 500,
          url: '/packages/enjoys/assets/qrcode.png',
          width: 84,
          height: 84,
          zIndex: 1
        }
      ],
      texts: [
        {
          x: 500,
          y: 303,
          fontSize: 34,
          color: 'rgb(219,214,179)',
          baseLine: 'center',
          textAlign: 'center',
          text: name,
          zIndex: 1
        },
        {
          x: 500,
          y: 500+84+8,
          fontSize: 10,
          color: '#737373',
          baseLine: 'top',
          textAlign: 'center',
          text: '长按识别二维码',
          zIndex: 1
        },
        {
          x: 500,
          y: 500+84+23,
          fontSize: 14,
          color: '#ffffff',
          baseLine: 'top',
          textAlign: 'center',
          text: '了解更多化学知识',
          zIndex: 1
        }
      ]
    };
    this.setData({ posterConfig: posterConfig }, () => {
        Poster.create(); 
    });

    return new Promise(next => {
      this._createShareImageHandler = next;
    });
  },

  onPosterSuccess(e) {
    const { detail } = e;
    this._createShareImageHandler(detail);
  },

  async getUserInfo() {
    return new Promise(next => {
      wx.getUserInfo({
        success: (res) => {
          var userInfo = res.userInfo
          var nickName = userInfo.nickName
          var avatarUrl = userInfo.avatarUrl
          var gender = userInfo.gender //性别 0：未知、1：男、2：女
          var province = userInfo.province
          var city = userInfo.city
          var country = userInfo.country
          next(userInfo);
        },
        fail: ()=>{
          next();
        }
      })
    })
  },

  async wait(time){
    return new Promise(next => {
      setTimeout(()=>{
        next();
      }, time)
    })
  },

  onShareAppMessage(){
    if(this._shareImg){
      return {
        title: '嗨，我刚刚获得到了一个证书',
        imageUrl: this._shareImg
      }
    }else{
      return {
        title: '我刚参加了一个化学知识考试，有点难呢',
      }
    }
  },

  onImageClick(e){
    let image = e.currentTarget.dataset.image;
    wx.previewImage({
        current: image,
        urls: [image]
    });
  }
})