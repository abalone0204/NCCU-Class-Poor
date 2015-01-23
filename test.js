var _ = require('underscore');
// var textUtil = require('../lib/util/text');
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var split = require('split');
var through = require('through');
var writeFilePath = '/Users/kudenny/side_projects/class/sample.js';

var data = require("./scripts/raw_data/raw_data_01_23.js").data;
// console.log(data);
cleanSpace(data);
for(var i =0; i< data.length; i++){
    data[i][0] = data[i][0].toString();
    data[i][1] = data[i][1].toString();
    data[i][3] = "";
    data[i][3] ="";
    data[i][5] = "";
    data[i][8]= "";
    if (data[i][15]) {
        data[i][15] = setUrlObj(data[i][15]);
    }
    if (data[i][16]) {
        data[i][16] = setUrlObj(data[i][16]);   
    }
    if (data[i][17]) {
        data[i][17] = setUrlObj(data[i][17]);   
    }
    data[i] =_.compact(data[i]);
}

var jsonResult= JSON.stringify(data);
// console.log(jsonResult);
writefile("cleanCourses=");
fs.appendFile(writeFilePath, jsonResult);
fs.appendFile(writeFilePath, ";");


function setUrlObj(rawData){
    var k = rawData.slice(rawData.length-6,rawData.length-2).toString();
        url = rawData.replace('=HYPERLINK("[', '').replace(']'+k+'")', '');
        rawData= {};
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