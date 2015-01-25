var filter = [],
  result,
  times,
  basicClassifications = [],
  paginations = [],
  perPage = 20,
  mountain=['百年', '道藩', '語視', '舜文大講堂','傳院劇場','國際','傳播'];


$("button").click(mainFunc);

$(document).keypress(function(e) {
  if (e.which == 13) {
    mainFunc();
  }
});

// Main

function mainFunc() {
  initAll();
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

// Init

function initAll() {
  clearMessage();
  $(".pagination-bar ul li").remove();

  if ($('.result-row').length > 0) {
    $('.result-row').remove();
  }
  result = [];
  paginations=[];
  setBasicClassifications();
  setFilter(filter);
}

function setBasicClassifications() {
  _.each(courses, function(d) {
    t = d[4].split("");
    if (t[2] == "系") {
      basicClassifications.push(t[0] + t[1]);
    }
  });
  basicClassifications = _.uniq(basicClassifications);
}

function setFilter(filter) {
  filter[1] = $("#point").val();
  filter[2] = $("#className").val();
  filter[3] = $("#proName").val();
  filter[4] = $("#classification").val();
  filter[5] = $("#timeClassification").val();
  filter[6] = $("#classLocation").val();
  console.log(filter[6]);

  return filter;
}



// View

function forcusOnTable() {
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
      $("a[data-page='" + key + "']").addClass("active");
      appendData(paginations[key]);
      forcusOnTable();
    }

  });
  $('.pagination-bar ul a').hover(function() {
    if (!$(this).hasClass("active")) {
      $(this).addClass("shadow");
    }
  }, function() {
    $(this).removeClass("shadow");
  });
  appendData(paginations[0]);
}

function appendData(data) {
  var maxNumOfTd = _.max(data, function(d) {
    return d[d.length - 1].length;
  });
  maxNumOfTd = maxNumOfTd[maxNumOfTd.length - 1].length;
  console.log(maxNumOfTd);
  $(".result-row").remove();
  _.each(data, function(d) {
    $(".resultTable").append("<tr class='" + d[0] + " result-row'></tr>");
    var $container = $("." + d[0]);
    _.map(d, function(item, i) {
      if (i == 11) {
        if (item == "N/A") {
          $container.append("<td></td>");
        } else {
          $container.append("<td>" + "<a href='' class='toggleNote' data-label='備註' data-note='" + item + "'>備註</a>" + "</td>");
        }
      } else if (i == 10) {
        if (item == "N/A") {
          $container.append("<td></td>");
        } else {
          $container.append("<td>" + "<a href='' class='toggleNote' data-label='異動資訊' data-note='" + item + "'>異動資訊</a>" + "</td>");

        }
      } else if (i == (d.length - 1)) {
        // 選課大綱要修改的部分
        agendaPairs = [];
        for (var l = 0; l < item.length; l++) {
          agendaPairs.push(_.pairs(item[l]));
        }
        _.each(agendaPairs, function(agendaPair) {
          _.each(agendaPair, function(agenda) {
            keyName = agenda[0];
            link = agenda[1];
            $container.append("<td><a href='" + link + "' target='_blank'>" + keyName + "</a></td>");
          });

        });
        if (item.length !== maxNumOfTd) {

          r = maxNumOfTd - item.length;
          for (var s = 0; s < r; s++) {
            $container.append("<td></td>");
          }
        }



      } else {
        $container.append("<td>" + item + "</td>");
      }

    });
  });
  $(".toggleNote").on('click', function(e) {
    e.preventDefault();
    $this = $(this);
    data = $this.data("note");
    $this.data("note", $this.text());
    $this.toggleClass("flash-note").text(data);
    if ($this.text() !== $this.data("label")) {
      $('html,body').animate({
          scrollTop: $this.offset().top - 100
        },
        'slow');
    }


  });
}

// 


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

function validationFilter(filter, data) {
  var tmp = [],
    reset, resetTime, resetClassification, resetTeacher,
    resetLocation;
  _.each(data, function(d) {
    if (filter[2]) {
      filterString = '.*' + filter[2].split('').join('.{0,1}') + '.*';
      rgxpClassName = new RegExp(filterString);
      if (d[2].match(rgxpClassName) !== null) {
        reset = filter[2];
        filter[2] = d[2];
      }
    }
    if (filter[3]) {
      var rgxpTeacher = new RegExp(filter[3]);
      if (d[3].match(rgxpTeacher) !== null) {
        resetTeacher = filter[3];
        filter[3] = d[3];
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

    if (filter[6]) {
      if (filter=='綜院') {
        if (d[6].match(/綜合/) !== null) {
          resetLocation = filter[6];
          filter[6] = d[6];
        }
      } else{
        var rgxpLocation = new RegExp(filter[6])
        if (d[6].match(rgxpLocation) !== null) {
          resetLocation = filter[6];
          filter[6] = d[6];
        }

      }
    }
    // placeHolder = d[8];
    // d[8] = "xxxx";
    if (finalFilter(filter, d)) {
      // d[8] = placeHolder;
      tmp.push(d);
      filter[2] = reset;
      filter[3] = resetTeacher;
      filter[4] = resetClassification;
      filter[6] = resetLocation;

    }
    // d[8] = placeHolder;
  });
  return tmp;
}

function finalFilter(filter, dataSet){
  flag = true;
  for(var i =0 ;i<filter.length;i++){
    if (filter[i] && (filter[i] !== dataSet[i])) {
      flag = false;
    }
  }
  return flag;
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