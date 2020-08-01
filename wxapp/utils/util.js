
module.exports = {
  deepClone(data) {
    var type = getType(data);
    var obj;
    if (type === 'array') {
      obj = [];
    } else if (type === 'object') {
      obj = {};
    } else {
      //不再具有下一层次
      return data;
    }
    if (type === 'array') {
      for (var i = 0, len = data.length; i < len; i++) {
        obj.push(deepClone(data[i]));
      }
    } else if (type === 'object') {
      for (var key in data) {
        obj[key] = deepClone(data[key]);
      }
    }
    return obj;
  }
}
