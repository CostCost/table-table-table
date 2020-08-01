module.exports = class WorkbookParse {
    constructor() {

    }

    Map(workbook) {
        let json = {};
        workbook.eachSheet((sheet) => {
            let sheetName = sheet.name;
            let obj = json[sheetName] = {};

            // 获取所有的keys
            let keys = [];
            sheet.getRow(1).eachCell((cell, col) => {
                if (col > 1) {//跳过id
                    keys.push(cell.text.trim());
                }
            });

            // 构建元素
            sheet.getColumn(1).eachCell((cell, row) => {
                if (row > 2) {//跳过key和备注
                    obj[cell.text.trim()] = {};
                    for (let i = 0; i < keys.length; i++) {
                        let key = keys[i];
                        let value = sheet.getCell(row, i + 2).text;
                        obj[cell.text][key] = parseXlsText(value);
                    }
                }
            });


        });
        return json;
    }

    Array(workbook, isTrim, ignoreNull) {
        let sheet = workbook.getWorksheet('disvocers');
        let rowCount = sheet.rowCount;
        let array = [];
        for(let i=0; i<rowCount; i++){
            let text = sheet.getCell(i+1, 1).text;
            if(isTrim){
                text = text.trim();
            }
            if(ignoreNull && text == ''){
                continue;
            }
            array.push(text);
        }

        return array
    }

    /**
     * 用于周期表等 通过x和y获取元素值
     * @param {*} workbook 
     * @return {
     *   'width': n,
     *   'height': n,
     *   'x': {
     *      'y': 'text',
     *      'y': 'text'
     *   },
     *   'x': {
     *      'y': 'text'
     *   },
     *   ...
     * } 
     * @like var eleNum = data[x][y]
     */
    Pos(workbook){
        let json = {};
        workbook.eachSheet((sheet) => {
            let sheetName = sheet.name;

            let xs = [];
            let xStop = false;
            sheet.getRow(1).eachCell((cell, col) => {
                if(!xStop && col > 1){
                    let x = cell.text.trim();
                    if(x == ''){//遇到空值
                        xStop = true;
                        return;
                    }
                    xs.push(x);
                }
            });

            let ys = [];
            let yStop = false;
            sheet.getColumn(1).eachCell((cell, row) => {
                if(!yStop && row > 1){
                    let y = cell.text.trim();
                    if(y == ''){//遇到空值
                        yStop = true;
                        return;
                    }
                    ys.push(y);
                }
            });
            

            let obj = {};
            obj.width = xs.length;
            obj.height = ys.length;
            for(var i=0; i<xs.length; i++){
                let x = xs[i];
                for(var j=0; j<ys.length; j++){
                    let y = ys[j];
                    let value = sheet.getCell(j+2, i+2).text.trim();
                    if(value != ''){
                        if(!obj[x]){
                            obj[x] = {};
                        }
                        obj[x][y] = value;
                    }
                }
            }

            json[sheetName] = obj;
        });
        return json;
    }
}

function parseXlsText(text){
    return unescape( text.replace(/\\u/g, '%u') );
}