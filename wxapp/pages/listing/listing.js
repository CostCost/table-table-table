import ElementService from '../../services/element';
import BaseBehavior from '../../behaviors/base';
import {ColorList} from '../../enums/colors';

Page({
  behaviors: [BaseBehavior],

  data: {
    scrollViewTop: 0,

    list: [],
    options: [],

    type: 'atomic_weight',
    name: '',
    unit: '',
    bgColor: '',
  },

  onLoad: function () {
    let query = wx.createSelectorQuery();
    query.select('.top-bar').boundingClientRect().exec((s)=>{
      this.setData({scrollViewTop: s[0].height});
    });
    
    let size = ElementService.getSize();
    let list = [];
    for (let number = 1; number <= size; number++) {
      let obj = ElementService.getElementDetail(number);
      list.push({
        number: number + '',
        symbol: obj.base.symbol,
        atomic_weight: obj.props.atomic_weight,//原子量
        electrons: obj.overview.electrons,
        neutrons: obj.overview.neutrons,
        atomic_radius: obj.atomic.atomic_radius,
        van_der_waals_radius: obj.atomic.van_der_waals_radius,
        covalent_radius: obj.atomic.covalent_radius,
        electronegtivity: obj.reactivity.electronegtivity,
        liquid_density: obj.addition.liquid_density,
        density: obj.props.density,
        max_brinell_hardness: obj.addition.max_brinell_hardness,
        mohs_hardness: obj.addition.mohs_hardness,
        max_vickers_hardness: obj.addition.max_vickers_hardness,
        bulk_modulus: obj.addition.bulk_modulus,
        youngs_modulus: obj.addition.youngs_modulus,
        shear_modulus: obj.addition.shear_modulus,
        sound_speed: obj.addition.sound_speed,
        thermal_conductivity: obj.addition.thermal_conductivity,
        molar_volume: obj.addition.molar_volume,

        progress: 0,//百分比
      });
    };
    list.sort((a, b) => {
      return a.number - b.number;
    })

    // options
    let options = [
      {type:'atomic_weight', name: '原子量 (相对原子质量)', color: ColorList[0], unit: '(g/mol)'},
      {type:'electrons', name: '电子', color: ColorList[1], unit: ''},
      {type:'number', name: '质子', color: ColorList[2], unit: ''},
      {type:'neutrons', name: '中子', color: ColorList[3], unit: ''},
      {type:'atomic_radius', name: '原子半径', color: ColorList[4], unit: 'pm'},
      {type:'van_der_waals_radius', name: '范德华半径', color: ColorList[5], unit: 'pm'},
      {type:'covalent_radius', name: '共价半径', color: ColorList[6], unit: 'pm'},
      {type:'electronegtivity', name: '电负性', color: ColorList[7], unit: ''},
      {type:'liquid_density', name: '液体密度', color: ColorList[8], unit: '(g/cm³)'},
      {type:'density', name: '密度', color: ColorList[9], unit: '(g/cm³)'},
      {type:'max_brinell_hardness', name: '布氏硬度', color: ColorList[10], unit: 'MPa'},
      {type:'mohs_hardness', name: '莫氏硬度', color: ColorList[11], unit: ''},
      {type:'max_vickers_hardness', name: '维氏硬度', color: ColorList[12], unit: 'Mpa'},
      {type:'bulk_modulus', name: '体积模量', color: ColorList[13], unit: 'GPa'},
      {type:'youngs_modulus', name: '杨氏模量', color: ColorList[14], unit: 'GPa'},
      {type:'shear_modulus', name: '剪切模量', color: ColorList[15], unit: 'GPa'},
      {type:'sound_speed', name: '该介质中声速', color: ColorList[16], unit: ''},
      {type:'thermal_conductivity', name: '导热系数', color: ColorList[17], unit: '(W/mK)'},
      {type:'molar_volume', name: '摩尔体积', color: ColorList[18], unit: '(cm³/mol)'},
    ];

    this.setData({
      list: list,
      options: options
    });

    this.changeType(this.data.type);
  },

  onReady: function () {
  },

  changeType(type){
    let total = 0;
    // 计算总计
    this.data.list.forEach(item => {
      total = Math.max(Number(item[type] || '0'), total);
    });
    // 计算百分比
    this.data.list.forEach(item => {
      item.progress = Number(item[type] || '0') / total * 100;
    });

    let opt = this.data.options.find(d => {
      return d.type == type
    });

    let unit = opt.unit;
    let name = opt.name;
    let bgColor = opt.color;

    this.setData({
      type: type,
      name: name,
      unit: unit,
      bgColor: bgColor,
      list: this.data.list
    });
  },

  onDropSelect(e){
    let type = e.detail.value;
    this.changeType(type);
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
})