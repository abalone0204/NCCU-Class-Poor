var filter = [],
  result,
  times,
  basicClassifications = [],
  paginations = [],
  perPage = 20;

_.each(courses, function(d) {
  t = d[4].split("");
  if (t[2] == "系") {
    basicClassifications.push(t[0] + t[1]);
  }
});
basicClassifications = _.uniq(basicClassifications);

$("button").click(mainFunc);

$(document).keypress(function(e) {
  if (e.which == 13) {
    mainFunc();
  }
});



function mainFunc() {
  clearMessage();
  $(".pagination-bar ul li").remove();

  if ($('.result-row').length > 0) {
    $('.result-row').remove();
  }
  setFilter(filter);
  if (_.compact(filter).length != 0) {
    if (filter[1] < 0) {
      hintMessage("你是想要被當嗎？哪來的負學分");
    } else {
      result = validationFilter(filter, courses);

      result = _.sortBy(result, function(d) {
        return d[5].split("")[1];
      });
      result = _.sortBy(result, function(d) {
        return d[2].split("").length;
      });
      if (result.length <= perPage) {
        appendData(result);
      } else {
        tableHintMessage("查詢的結果大於" + perPage + "筆，為了防止眼花，幫你做了分頁", "請不要擔心，點分頁不會讓你的搜尋不見");
        pagination(result);
      }
      forcusOnTable();
    }
    // 分頁功能
  } else {
    hintMessage("你還沒有輸入搜尋條件喔！");

  }
}



var chineseNumber = ["一", "二", "三", "四", "甲", "乙", "丙"];
function forcusOnTable(){
        $('html,body').animate({
          scrollTop: $(".table-hint-messages").offset().top
        },
        'slow');
}


function hintMessage(message) {
  if (typeof(message) == "string") {
    $(".hint-messages").append("<p>" + message + "</p>");

  }
}

function clearMessage() {
  $(".hint-messages p").remove();
  $(".table-hint-messages p").remove();
}

function tableHintMessage(message, message2) {
  $(".table-hint-messages").append("<p>" + message + "</p>");
  $(".table-hint-messages").append("<p>" + message2 + "</p>");
}

function appendPaginationBar(pageCount) {
  $(".pagination-bar ul li").remove();
  for (var key = 0; key < pageCount; key++) {
    if (key == 0) {
      $(".pagination-bar ul").append("<li><a href='' class='active' data-page='" + key + "'>" + (key + 1) + "</a></li>");
    } else {
      $(".pagination-bar ul").append("<li><a href='' data-page='" + key + "'>" + (key + 1) + "</a></li>");
    }
  }

}

function pagination(result) {
  total = Math.ceil(result.length / perPage);
  for (var i = 0; i < total; i++) {
    paginations.push(result.slice(i * perPage, (i + 1) * perPage));
  }
  appendPaginationBar(total);
  $(".pagination-bar ul a").on("click", function(e) {
    e.preventDefault();
    $this = $(this);
    key = $this.data("page");
    if (!$this.hasClass("active")) {
      $(".pagination-bar ul a").removeClass("active");
      $(this).addClass("active");
      appendData(paginations[key]);
      forcusOnTable();
    }

  });
  appendData(paginations[0]);
}

function classify(name) {
  if (name[2] == '系') {
    return name[0] + name[1] + name[2];
  }
  if (_.contains(name, "碩") || _.contains(name, "博")) {
    return name[0] + name[1] + "所";
  } else if (name[0] == "地" && (testChinese(name))) {
    return "地政系";
  } else if (testChinese(name)) {
    return name[0] + name[1] + '系';
  } else {
    return name.join("");
  }
}

function testChinese(name) {
  if (_.contains(name, "一") || _.contains(name, "二") || _.contains(name, "三") || _.contains(name, "四")) {
    return true;
  } else {
    return false;
  }
}

function appendData(data) {
  $(".result-row").remove();
  _.each(data, function(d) {
    $(".resultTable").append("<tr class='" + d[0] + " result-row'></tr>");
    _.map(d, function(item, i) {
      if (i == 10) {
        if (item == "＠備註Note:N/A") {
          $("." + d[0]).append("<td>" + "無" + "</td>");
        } else {
          $("." + d[0]).append("<td>" + "<a href='' class='showNote' data-note='" + item + "'>備註</a>" + "</td>");

        }
      } else if (i == 9) {
        if (item == "＠異動資訊Information of alteration:N/A") {
          $("." + d[0]).append("<td>" + "無" + "</td>");
        } else {
          $("." + d[0]).append("<td>" + item.split('').slice(31).join('') + "</td>");
        }
      } else if (i == 11) {

        $("." + d[0]).append("<td>" + "<a href='" + item + "' target='_blank'>選課大綱</a>" + "</td>");
      } else {
        $("." + d[0]).append("<td>" + item + "</td>");
      }

    });
  });
  $(".showNote").click(function(e) {
    e.preventDefault();
    $this = $(this);
    data = $this.data("note");
    $this.append("div").addClass("note-flash").text(data);
  });
}

function validationFilter(filter, data) {
  var tmp = [],
    reset, resetTime, resetClassification;
  _.each(data, function(d) {
    if (filter[2]) {
      if (validateClassName(filter, d)) {
        reset = filter[2];
        filter[2] = d[2];
      }
    }

    if (filter[4]) {
      if (filter[4] == d[4]) {
        resetClassification = filter[4];
        filter[4] = d[4];
      } else if (filter[4][0] == "地" & d[4][0] == filter[4][0]) {
        resetClassification = filter[4];
        filter[4] = d[4];
      } else if (_.contains(basicClassifications, filter[4])) {
        if (d[4].substr(0, 2) == filter[4]) {
          resetClassification = filter[4];
          filter[4] = d[4];
        }
      }
    }
    placeHolder = d[7];
    d[7] = "xxxx";
    if (_.intersection(_.compact(filter), d).length == _.compact(filter).length) {
      d[7] = placeHolder;
      tmp.push(d);
      filter[2] = reset;
      filter[4] = resetClassification;
    }
    d[7] = placeHolder;
  });
  _.each(tmp, function(d) {
    if (d[0].split('').length < 9) {
      t = 9 - d[0].split('').length;
      ins = [];
      for (var i = 0; i < t; i++) {
        ins.push(0);
      }
      d[0] = ins.join('') + d[0];
    }
    if (d.length < 12) {
      // 處理課程大綱
      var url = ["http://newdoc.nccu.edu.tw/teaschm/1032/set00.jsp-yy=103&smt=2&num=", "&gop=", "&s=", "&willtpe=", ".htm"],
      firstPart = d[0].substr(0, 6),
      secondPart = d[0].substr(6, 2);
      lastPart = d[0].substr(8, 1);
      if (d[2] == "資料處理" || d[2] == "軟體應用導論") {
        wiltpe = "1";
      } else {
        wiltpe = "0";
      }
      str = url[0] + firstPart + url[1] + secondPart + url[2] + lastPart + url[3] + wiltpe + url[4];
      d.push(str);
    }

  });
  return tmp;
}

function setFilter(filter) {
  filter[1] = $("#point").val();
  filter[2] = $("#className").val();
  filter[3] = $("#proName").val();
  filter[4] = $("#classification").val();
  filter[5] = $("#timeClassification").val();

  return filter;
}

function validateClassName(filter, item) {
  var target = filter[2].split(""),
    data = item[2].split(""),
    flag;
  interLength = parseFloat(_.intersection(target, data).length);
  if (_.intersection(target, data) === 0) {
    flag = false;
  } else if (target.join("") == data.join("")) {
    flag = true;
  } else if (target.length > data.length) {
    if (interLength / target.length > 0.5) {
      flag = true;
    }
  } else if ((data.length - target.length) <= target.length) {
    if (interLength == target.length) {
      flag = true;
    }
  } else if (data.length >= 5) {
    if (interLength / target.length > 0.5) {
      flag = true;
    }
  } else {
    flag = false;
  }
  if (flag) {
    return true;
  } else {
    return false;
  }
}

function validateTime(filter, item) {
  var target = filter[5].split(""),
    data = item[5].split("");
  if (data[0] == target[0]) {
    if (_.intersection(target, data).length - 1 >= 2) {
      return true;
    } else {
      return false;
    }
  }
}