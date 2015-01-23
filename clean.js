var _ = require('underscore');
// var textUtil = require('../lib/util/text');
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var split = require('split');
var through = require('through');

var data = require("./scripts/raw_data/raw_data_01_23.js").data;

var fileContent = "";
excute();

function remove(array, n) {
    return array.slice(0, n).concat(array.slice(n + 1, array.length));
}


function excute(cb) {
    // var fileName = fileName;
    var fileName = 'scripts/raw_data/raw_data_01_23.js';
    var instream = fs.createReadStream(fileName);
    console.log(instream);
    var tags = [];
    var lineCount = 0;

    var lines = [];

    var currentLines = 0;
    var errors = [];
    // console.log(sampleIndex.length);
    // var currentTarget = sampleIndex.shift();
    var tr = through(function(line) {
        console.log(line);
        // 學年/學期,科目代號,學分數,科目名稱(中),科目名稱(英),授課教師(中),授課教師(英),開課系級,上課時間(中),上課時間(英),修別,授課語文,是否為核心通識,異動備註,科目備註說明,,,,,
        // 103/2,211012,3,政治學,Political science,蔡中民,TSAI CHUNG-MIN,政治系,三234,wed234 wed 234,必,中文,否,＠異動資訊Information of alteration:N/A,＠備註Note:政治系優先，本課程設有TA課，時間為三C。,,,,,
        if (lineCount >= 2) {
            // if (lineCount === 1626) {

            line = line.toString();
            // line = line.replace('"', '');
            line = _.compact(line.split('')).join('')

            var data = line.split(',');

            line = data.join('","');
            if (line[0] != '"') {
                line = '"' + line + '"';    
            };
            


            // console.log(line);
            lines.push(line);
        }

        lineCount++;
    }, function() {
        console.log("done");
        console.log(lines.length)
        var result = lines.join("],\n[");
        result = "var courses=[[" + result + "]]";
        writefile(result);
        if (errors.length > 0) {
            console.log("errors");
            console.log(errors);
        }
        // cb(lines);
    });

    instream.pipe(split())
        .pipe(tr);

}

function writefile(result) {
    var fileName = '/Users/kudenny/side_projects/class/sample.js';

    fs.writeFile(fileName, result, function(err) {
        if (err) {
            console.log("ERROR:")
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
}