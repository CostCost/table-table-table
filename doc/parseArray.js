var fs = require('fs');
var clipboardy = require('clipboardy');
var readclipboard = true;

var smail = `
`;

if(readclipboard){
    smail = clipboardy.readSync();
}

let arrayName = 'v1';
// 过滤空行
smail = smail.split('\n').filter(l => {
    return l.trim();
});
smail = smail.map(l => l.trim())

function getValueByName(aputLineNum, valueName){
    for(let i=aputLineNum; i>=0; i--){
        let line = smail[i];
        if(line.indexOf('const') == 0 && line.indexOf(` ${valueName},`) >= 0){//存在
            if(line.indexOf('const-string') >= 0){
                return line.replace('const-string', '').replace(` ${valueName},`, '').trim().replace(/"/g, '');
            }else{
                return '';
            }
        }
    }
    return '';
}

var list = [];
for(let i=smail.length-1; i>=0; i--){
    let line = smail[i];
    if(line.indexOf('new-array') == 0){//遇到起点了
        break;
    }
    if(line.indexOf('aput-object') == 0){
        let valueName = line.replace('aput-object', '').split(',')[0];
        valueName = valueName.trim();//v8
        let value = getValueByName(i, valueName);
        list.push(value);
    }
}
list = list.reverse();

console.log(list, list.length == 127 ? '[success]' : '警告！长度不为127', list.length);

let text = '';
for(let i=0; i<list.length; i++){
    text += '"' + list[i] + '"\n'
}

fs.writeFileSync('./last-parse.txt', text);

if(clipboardy){
    let buf = list.join('\n');
    clipboardy.writeSync(buf);
}