var _ = require('underscore');
// var textUtil = require('../lib/util/text');
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var split = require('split');
var through = require('through');
// node clear_data.js filename source_data
var date = new Date(),
    timestamp = ['data-', 0, date.getMonth() + 1, '-', date.getDate()].join('');

var writeFilePath = './scripts/data/' + timestamp + '.js';
console.log("Your clean data saved at " + writeFilePath);
var rawDataPath = process.argv[2];
console.log(rawDataPath);
var data = require('./' + rawDataPath).data;
// For test
var test = [];
// 
cleanSpace(data);
for (var i = 0; i < data.length; i++) {
    data[i][0] = data[i][0].toString();
    if (i ===1 ) {
        console.log(data[i]);
    }
    if (data[i][0].length < 9) {
        t = 9 - data[i][0].split('').length;
        ins = [];
        for (var k = 0; k < t; k++) {
            ins.push(0);
        }
        data[i][0] = ins.join('') + data[i][0];
    }

    data[i][1] = data[i][1].toString();
    objHolder = [];
    for (var k = 2; k < data[i].length; k++) {
        if (data[i][k].substr(0, 10) == "=HYPERLINK") {
            objHolder.push(setUrlObj(data[i][k]));
            data[i][k] = '';
        } else if (isEngDate(data[i][k])) {
            data[i][k] = '';
        } else if (data[i][k].match(/^[A-Za-z].*/) !== null) {
            // Ref. Note NA還有UNIX是例外
            if (data[i][k] !== "UNIX系統程式設計") {
                data[i][k] = '';
            }
        } else if(data[i][k] == '3D game programming' || data[i][k] =='19th Century English Literature'|| data[i][k] =='20th Century English Literature'){
            data[i][k] = '';
        } 
        data[i][k] = data[i][k].replace('＠備註Note:', '');
        data[i][k] = data[i][k].replace('＠異動資訊Information of alteration:', '');
    }


    data[i] = _.compact(data[i]);
    data[i].push(objHolder);
    if (data[i].length<13) {
        data[i].splice(6, 0, '暫缺資料');
    }

}


num = [];
test = {
    11: [],
    12: [],
    13: [],
    14: [],
    15: []
};
console.log(data[0].length);

_.each(data, function(d) {
    num.push(d.length);
    test[d.length].push(d);
});

console.log(test[12]);
console.log(test[12].length);
num = _.uniq(num);
console.log(num);



var jsonResult = JSON.stringify(data);
// console.log(jsonResult);
writefile("courses=");
fs.appendFile(writeFilePath, jsonResult);
fs.appendFile(writeFilePath, ";");


function setUrlObj(rawData) {
    var k = rawData.replace(')"', '').match(/\].+\)/)[0].replace(']', '');
    if (k.match(/\"/) !== null) {
        k = k.replace('")', '');
    }
    url = rawData.match(/http.+\.htm/)[0];

    rawData = {};
    // 測試用
    test.push(k);

    rawData[k] = url;
    return rawData;
}

function cleanSpace(data) {
    _.each(data, function(d) {
        d.shift();
        for (var i = d.length - 1; i >= 0; i--) {
            if (typeof(d[i]) == 'string') {
                d[i] = d[i].trim();

            }
        }
    });
}

function isEngDate(date) {
    if (date.match(/^mon.+/) !== null || date.match(/^tue.+/) !== null || date.match(/^wed.+/) !== null || date.match(/^thu.+/) !== null || date.match(/^fri.+/) !== null || date.match(/^sat.+/) !== null || date.match(/^sat.+/) !== null) {
        return true;
    } else {
        return false;
    }
}

function writefile(result) {

    fs.writeFileSync(writeFilePath, result);
}