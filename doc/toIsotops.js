const fs = require('fs');

let isotops = JSON.parse(fs.readFileSync('isotops.json', {encoding: 'utf8'})).rows;
console.log(isotops.length)

let obj = {};

isotops.forEach(item => {
    delete item.rowid;
    delete item._id;
    if(!obj[item.number]){
        obj[item.number] = [];
    }
    obj[item.number].push(item);
});

let data = JSON.stringify(obj);
fs.writeFileSync('isotops-new.json', data)