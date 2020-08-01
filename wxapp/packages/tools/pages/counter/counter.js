import BigEval from './BigEval';
import logic from './logic';
import BaseBehavior from '../../../../behaviors/base';
Page({
  behaviors: [BaseBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    formula: '',
    formulaRich: '',
    result: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  bindReplaceInput(e){
    let value = e.detail.value;
    let pos = e.detail.cursor;
    if(pos == undefined){
      return;
    }
    
    let left = value.substring(0, pos);
    let right = value.substr(pos);
    
    left = left.replace(/[^A-z0-9\[\]\(\)]/g, '');
    
    let newValue = left + right;

    this.setData({
      formula: newValue
    });
    this.gen();

    return {
      value: newValue,
      cursor: left.length
    }
  },

  gen(){
    let result = logic(this.data.formula);
    this.setData({
      result: result,
      formulaRich: this.toRichText(this.data.formula)
    })
  },

  toRichText(text){
    var arr = [];
    var last = null;
    for(var i=0; i<text.length; i++){
        var t = text[i];
        var reg = /[0-9]/;
        if(reg.test(t)){//是数字
            if(last == null){//第一个匹配数字
                last = '<sub><small>';
            }
            last += t;
        }else{//非数字
            if(last){//上次是数字
                arr.push(last + '</small></sub>');
                last = null;
            }
            arr.push(t);
        }
    }
    if(last){//上次是数字
        arr.push(last + '</sub>');
        last = null;
    }
    return arr.join('');
  },

  addBracket(){
    let value = this.data.formula;
    let addSt = ''; 
    for(let i=this.data.formula.length-1; i>=0; i--){
      if(this.data.formula[i] == '['){
        addSt = ']';
        break;
      }
      else if(this.data.formula[i] == ']'){
        addSt = '[';
        break;
      }
    }
    if(addSt == ''){
      addSt = '[';
    }
    this.setData({
      formula: value + addSt
    });
    this.gen();
  },

  onShareAppMessage: function () {
    return {
      title: this.getShareTitle(),
      path: this.getSharePath()
    }
  }
})