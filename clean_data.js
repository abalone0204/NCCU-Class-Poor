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
    if (data[i][0].length < 9) {
        t = 9 - data[i][0].split('').length;
        ins = [];
        for (var k = 0; k < t; k++) {
            ins.push(0);
        }
        data[i][0] = ins.join('') + data[i][0];
    }
    data[i][1] = data[i][1].toString();
    data[i][3] = "";
    data[i][3] = "";
    data[i][5] = "";
    data[i][8] = "";
    objHolder = [];
    for(k = 9; k<data[i].length; k++){
        if (data[i][k].substr(0,10) =="=HYPERLINK") {
            objHolder.push(setUrlObj(data[i][k]));
            data[i][k] = '';
        }
    }
    data[i] = _.compact(data[i]);   
    data[i].push(objHolder)

}

test = _.uniq(test);
console.log(test);

var jsonResult = JSON.stringify(data);
// console.log(jsonResult);
writefile("courses=");
fs.appendFile(writeFilePath, jsonResult);
fs.appendFile(writeFilePath, ";");


function setUrlObj(rawData) {
    var k = rawData.slice(rawData.length - 6, rawData.length - 2).toString();
    if (k != "教學大綱" || k!= "系所設定") {
        k = rawData.replace(')"','').match(/\].+\)/)[0].replace(']','')
        url = rawData.replace('=HYPERLINK("[', '').replace(/\].+\(.+\)/, '')
    } else{
        url = rawData.replace('=HYPERLINK("[', '').replace(']' + k + '")', '');    
    };
    
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


function writefile(result) {

    fs.writeFileSync(writeFilePath, result);
}