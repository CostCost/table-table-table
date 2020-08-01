import ElementService from '../../services/element';
import BaseBehavior from '../../behaviors/base';
import DBIsotops from '../../database/isotops';

Page({
  behaviors: [BaseBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    scrollViewTop: 0,

    keyword: '',
  },

  onLoad: function () {
  },

  onReady(){
    let query = wx.createSelectorQuery();
    query.select('.top-bar').boundingClientRect().exec((s)=>{
      this.setData({scrollViewTop: s[0].height});
    });

    let size = ElementService.getSize();
    let list = [];
    for(let number=1; number<=size; number++){
      let obj = ElementService.getElementDetail(number);
      list.push({
        number: number+'',
        name: obj.base.name,
        en_name: obj.base.en_name,
        symbol: obj.base.symbol,
        cat_color: ElementService.getCategoryColor(number),
        cat: obj.base.category,
        year: obj.overview.discovered_year,
        atomic_weight: obj.props.atomic_weight,//原子量
        density: obj.props.density,//密度
        electrical_conductivity: obj.electrom.electrical_conductivity,//电导率
        cas: obj.addition.cas_number,//CAS
        electronegtivity: obj.reactivity.electronegtivity,//电负性
        atomic_radius: obj.atomic.atomic_radius,//原子半径
        electrons: obj.overview.electrons,//电子数量
        isotiosCnt: DBIsotops[number] ? DBIsotops[number].length : 0,
        show: true
      });
    };

    list.sort((a, b)=>{
      return (a.symbol).localeCompare((b.symbol));
    })
    this.setData({
      list: list
    });
  },

  filterAll(value){
    value = (value || '').trim().toLocaleLowerCase();
    this.data.list.forEach(e => {
      if(!value){
        e.show = true;
      }else{
        if(
            e['number'].toLocaleLowerCase().indexOf(value) >= 0 ||
            e['name'].toLocaleLowerCase().indexOf(value) >= 0 ||
            e['en_name'].toLocaleLowerCase().indexOf(value) >= 0 ||
            e['symbol'].toLocaleLowerCase().indexOf(value) >= 0 ||
            e['cat_color'].toLocaleLowerCase().indexOf(value) >= 0 ||
            e['cat'].toLocaleLowerCase().indexOf(value) >= 0 ||
            e['year'].toLocaleLowerCase().indexOf(value) >= 0 ||
            e['atomic_weight'].toLocaleLowerCase().indexOf(value) >= 0 ||
            e['density'].toLocaleLowerCase().indexOf(value) >= 0 ||
            e['electrical_conductivity'].toLocaleLowerCase().indexOf(value) >= 0 ||
            e['cas'].toLocaleLowerCase().indexOf(value) >= 0 ||
            e['electronegtivity'].toLocaleLowerCase().indexOf(value) >= 0 ||
            e['atomic_radius'].toLocaleLowerCase().indexOf(value) >= 0 ||
            e['electrons'].toLocaleLowerCase().indexOf(value) >= 0
        ){
          e.show = true;
        }else{
          e.show = false;
        }
      }
    });
    this.setData({
      list: this.data.list
    })
  },

  onInput(e){
    if(this.lastHandler){
      clearTimeout(this.lastHandler);
    }

    let value = e.detail.value;
    this.setData({
      keyword: value
    })

    this.lastHandler = setTimeout(()=>{
      this.filterAll(value);

      this.lastHandler = null;
    }, 300);
  },

  clearKeyword(){
    this.onInput({
      detail: {
        value: ''
      }
    })
  },

  onShareAppMessage(){
    return {
      title: this.getShareTitle(),
      path: this.getSharePath()
    };
  }
})