import BaseBehavior from '../../behaviors/base';
import ElectronicShell from '../../utils/electronic-shell';
import ElementService from '../../services/element';
import Discovers from '../../database/discovers';
import Summary from '../../database/summary';
import {dark as CatColorDark, light as CatColorLight, options as CatNames} from '../../enums/category';
import ElementColor from '../../enums/element-color';
import {GridName} from '../../enums/grid';
import {FHAS} from '../../enums/sundries';
import HasImage from '../../enums/has-image';
import HasSpec from '../../enums/has-spec';

Page({
  behaviors: [BaseBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    navOpacity: 0,//导航栏透明度
    isFirstPage: false,//是否为第一页，用于返回按钮

    eleImage: '',//元素图片
    eleShellImage: null,//电子层图片
    // eleShellImageBig: null,//电子层大图
    lightImage: null,//光谱
    structImage: null,//结构体图片
    catName: null,//分类名

    isShowShellAlert: false,
    paging: {},//上个下一个

    detail: null,
    eleColor: '',//元素颜色
    catColor: '',//分类颜色
    electronShellText: '',//电子层显示文本
    discoveredYear: '',//发现时间 #远古时期 &lt;600* <600公元前 *公元前 
    discoveredBys: [],//发现者
    summary: '-',//备注
    meltingPoint: null,//熔点{c,f,k}
    boilingPoint: null,//沸点{c,f,k}
    valenceElectrons: '',//化合价
    period: '',//周期
    family: '',//族
    electronConfig: [],//电子分布
    ionCharge: '',//离子电荷量
    superconductingPoint: null,//超导点
    debyeTemperature: null,//德拜温度
    halfLife: '',//半衰期
    lifetime: '',//寿命
    hazards: null,//危险性
    hazardNames: null,//危险性名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages();
    if(pages.length == 1){
      this.setData({isFirstPage: true});
    }else{
      this.setData({isFirstPage: false});
    }

    this.es = new ElectronicShell('#canvas');

    let number =  options.number || '1';
    this.initElement(number);

    // 插屏广告
    {
      let interstitialAd = null

      // 在页面onLoad回调事件中创建插屏广告实例
      if (wx.createInterstitialAd) {
        interstitialAd = wx.createInterstitialAd({
          adUnitId: 'adunit-87c2acda7802549f'
        })
        interstitialAd.onLoad(() => { })
        interstitialAd.onError((err) => { })
        interstitialAd.onClose(() => { })
      }

      // 在适合的场景显示插屏广告
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error(err)
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  async initElement(number){
    let detail = ElementService.getElementDetail(number);

    // 分类颜色
    let category = detail.base.category;
    let catColor = this._isDark ? CatColorDark[category] : CatColorLight[category];
    // 分类名
    let catName = CatNames[category];
    // 电子层显示文本
    let electronShellText = detail.overview.electron_shell;
    electronShellText = electronShellText.replace(/-/g, ' ');
    // 发现者数组
    let discoveredBys = detail.overview.discovered_by.split('/').filter(d=>d).map(id => {
      return Discovers[id];
    });
    // 发现年份
    let discoveredYear = detail.overview.discovered_year.replace('&lt;', '<').replace('*', ' 公元前').replace('#', '远古时期');
    // 备注
    let summary = Summary[number-1];
    // 熔点
    let meltingPoint = this.getCFK(detail.props.melting_point);
    // 沸点
    let boilingPoint = this.getCFK(detail.props.boiling_point);
    // 化合价
    let valenceElectrons = detail.reactivity.valence_electrons.replace(/1/g, 'I').replace(/2/g, 'II').replace(/3/g, 'III').replace(/4/g, 'IV').replace(/5/g, 'V').replace(/6/g, 'VI').replace(/7/g, 'VII').replace(/8/g, 'VIII').replace(/9/g, 'VIIII');
    // 周期 族
    let period = detail.props.group.split('/')[0];
    let family = detail.props.group.split('/')[1];
    family = family && family.replace('+', 'A').replace('-', 'B');
    // 元素图片
    let eleImage = `https://wxapp-pt.oss-cn-beijing.aliyuncs.com/elements/element_${number}.jpg`;
    // 光谱
    let lightImage = `https://wxapp-pt.oss-cn-beijing.aliyuncs.com/lights/element_spec_${detail.base.symbol.toLowerCase()}.jpg`;
    // 电子分布
    let electronConfig = detail.atomic.electron_config.split('=').map((t, i) => {
      t = t.trim();

      let findIdx = t.indexOf(']');
      let first = t.substring(0, findIdx);
      t = t.substr(findIdx < 0 ? 0 : findIdx);

      let temps = t.trim().split(' ');
      let text = '';
      for(let i=0; i<temps.length; i++){
        let temp = temps[i];
        let a = temp[0];
        let b = temp[1];
        let c = temp.substr(2);
        text += `${a}${b}<sup><small>${c}</small></sup> `
      }
      return `${first}${text}`;
    });
    // 离子电荷量
    let ionCharge = detail.atomic.ion_charge.split('/').map((t, i) => {
      t = t.trim();
      if(!t){
        return '';
      }
      return `${detail.base.symbol}<sup><small>${t}</small></sup>`;
    }).join(', ');
    // 超导点
    let superconductingPoint = this.getCFKByK(detail.electrom.superconducting_point);
    // 晶体结构名
    let crystalStructure = GridName[detail.grid.crystal_structure];
    // 结构图片
    let structImage = `https://wxapp-pt.oss-cn-beijing.aliyuncs.com/structs/struct${detail.grid.crystal_structure}.png`;
    // 德拜温度
    let debyeTemperature = this.getCFKByK(detail.grid.debye_temperature);
    // 半衰期getNuclearTime
    let halfLife = this.getNuclearTime(detail.nuclear.half_life);
    // 寿命
    let lifetime = this.getNuclearTime(detail.nuclear.lifetime);
    // 危险性
    let hazards = this.getFhas(detail.nuclear.hazards);
    let hazardNames = this.getFhasName(detail.nuclear.hazards);
    // 元素颜色
    let eleColor = ElementColor[detail.addition.colour];

    this.setData({
      detail: detail,
      catName: catName,
      catColor: catColor,
      electronShellText: electronShellText,
      discoveredBys: discoveredBys,
      discoveredYear: discoveredYear,
      summary: summary,
      meltingPoint: meltingPoint,
      boilingPoint: boilingPoint,
      valenceElectrons: valenceElectrons,
      period: period,
      family: family,
      eleImage: eleImage,
      lightImage: lightImage,
      electronConfig: electronConfig,
      ionCharge: ionCharge,
      superconductingPoint: superconductingPoint,
      crystalStructure: crystalStructure,
      structImage: structImage,
      debyeTemperature: debyeTemperature,
      halfLife: halfLife,
      lifetime: lifetime,
      hazards: hazards,
      hazardNames: hazardNames,
      paging: this.getPaging(number),
      eleColor: eleColor,
    })

    let es = this.es;
    let image = await es.getImage(this.data.detail.overview.electron_shell, true);
    // let imageBig = await es.getImage(this.data.detail.overview.electron_shell, false);
    this.setData({
      eleShellImage: image,
      // eleShellImageBig: image //imageBig
    });
  },

  onChangeElement(e){
    let number = e.currentTarget.dataset['number'];
    if(number){
      this.initElement(number);
    }
  },

  getPaging(number){
    let prev = Number(number) - 1;
    let next = Number(number) + 1;
    let prevBase = ElementService.getBaseInfo(prev);
    let nextBase = ElementService.getBaseInfo(next);
    let p = {};
    if(prevBase){
      p.prev = {
        number: prev + '',
        name: prevBase.name
      };
    }
    if(nextBase){
      p.next = {
        number: next + '',
        name: nextBase.name
      };
    }
    return p;
  },

  onPageScroll(e){
    if(e.scrollTop > 80){
      if(this.data.navOpacity < 0.5){//当前是透明的
        this.setData({
          navOpacity: 1
        })
      }
    }else{
      if(this.data.navOpacity >= 0.5){//当前是透明的
        this.setData({
          navOpacity: 0
        })
      }
    }
  },

  /**
   * 获取摄氏度、华氏度、开氏度
   * 传入的是空，则返回空
   */
  getCFK(c){
    if(c == '' || c == null){
      return null;
    }
    c = Number(c);

    let f = 32 + c * 1.8;
    let k = 273.15 + c;
    return {
      c: Math.round(c * 100) / 100,
      f: Math.round(f * 100) / 100,
      k: Math.round(k * 100) / 100,
    }
  },

  /**
   * 获取摄氏度、华氏度、开氏度
   * 传入的是空，则返回空
   */
  getCFKByK(k){
    if(k == '' || k == null){
      return null;
    }
    k = Number(k);

    let c = k - 273.15;
    let f = 32 + c * 1.8;
    return {
      c: Math.round(c * 100) / 100,
      f: Math.round(f * 100) / 100,
      k: Math.round(k * 100) / 100,
    }
  },

  /**
   * 处理半衰期、寿命字段
   * @param {*} str 
   */
  getNuclearTime(str){
    if(!str){
      return;
    }
    let temp = str.split('/');
    let dw = '';
    if(temp[1]){
      dw = temp[1].replace('1', ' 年').replace('2', ' 天').replace('3', ' 小时').replace('4', ' 分钟').replace('5', ' 秒');
    }
    return temp[0] + dw;
  },

  getFhas(str){
    if(!str){
      return null;
    }
    let temp = str.split(',').map(t => t.trim().replace('-', ''));
    return {
      f: temp[0] || '',
      h: temp[1] || '',
      a: temp[2] || '',
      s: temp[3] || '',
    }
  },

  getFhasName(str){
    let temp = this.getFhas(str);
    if(!temp){
      return null;
    }
    return {
      f: FHAS['f'][temp.f],
      h: FHAS['h'][temp.h],
      a: FHAS['a'][temp.a],
      s: FHAS['s'][temp.s],
    }
  },

  onBackClick(){
    if(this.data.isFirstPage){
      wx.switchTab({
        url: '/pages/index/index'
      });
    }else{
      wx.navigateBack();
    }
  },

  showShellAlert(){
    this.setData({
      isShowShellAlert: true
    })
  },

  hideShellAlert(){
    this.setData({
      isShowShellAlert: false
    })
  },

  onPreviewImage(){
    if(!HasImage[this.data.detail.id]){
      return;
    }
    wx.previewImage({
      urls: [this.data.eleImage],
    });
  },

  onPreviewLight(){
    if(!HasSpec[this.data.detail.base.symbol.toLowerCase()]){
      return;
    }
    wx.previewImage({
      urls: [this.data.lightImage],
    });
  },

  onShareAppMessage: function () {
    let name = this.data.detail.base.name;
    let symbol = this.data.detail.base.symbol;
    let summary = this.data.summary;
    return {
      title: (!summary || summary == '-') ? `${name} (${symbol}) 元素？能吃吗？` : summary,
      path: '/pages/element/element?number=' + this.data.detail.id
    }
  }
})