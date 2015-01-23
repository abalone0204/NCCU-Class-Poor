var _ = require('underscore');
// var textUtil = require('../lib/util/text');
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var split = require('split');
var through = require('through');

var data = require("./scripts/raw_data/raw_data_01_23.js").data;
// console.log(data);
cleanSpace(data);
_.each(data, function(d){
    d[3] ="";
    d[5] = "";
    d[8]= "";
    if (d[15]) {
        d[15] = setUrlObj(d[15]);
    }
    if (d[16]) {
        d[16] = setUrlObj(d[16]);   
    }
    if (d[17]) {
        d[17] = setUrlObj(d[17]);   
    }

    d = _.compact(d);
});

result = [];
result.push(data);
console.log(result);
// writefile(result);
// result = JSON.parse(data);
// result=JSON.stringify(data);

// writefile(result);

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
    var fileName = '/Users/kudenny/side_projects/class/sample.js';

    fs.writeFileSync(fileName, result, function(err) {
        if (err) {
            console.log("ERROR:");
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
}