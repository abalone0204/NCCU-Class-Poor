var fill = d3.scale.category20(),
  cloudSampleNum = 25;
var w = $('.search').width(),
  h = $('.search').height(),
  margin = {
    left: 15,
    top: 20
  },
  center = {
    x: ~~(w / 2),
    y: ~~(h / 2)
  };



// Text setting
var textStyle = {
    "font-size": function(d) {
      return d.size + "px";
    },
    "font-family": "Impact",
    "fill": '#999',
    'opacity': 0
  },
  textAttr = {
    "text-anchor": 'middle',
    "transform": function(d, i) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    }
  };

renderCloud();

function draw(words) {
  var canvas = d3.select("#textCloud")
    .append("svg").attr({
      "width": w,
      "height": h
    });
  var text = canvas.append("g")
    .attr("transform", "translate(" + [center.x, center.y] + ")")
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style(textStyle);

  text.text(function(d) {
      return d.text;
    })
    .style('opacity', 0);
  text.transition()
    .duration(500)
    .delay(function(d, i) {
      return i * 10;
    })
    .attr(textAttr)
    .style('opacity', 1);
  text.transition()
    .delay(500)
    .duration(500)
    .style('fill', '#DDD');
  // title
  var titleAttr = {
      x: center.x,
      y: center.y,
      "text-anchor": 'middle',
    },
    titleStyle = {
      'fill': '#0d7963',
      'opacity': 0,
      'font-size': 50,
    };
  title = canvas.append('text')
    .attr(titleAttr)
    .style(titleStyle)
    .text("NCCU選課查詢好棒棒");
  title.transition()
    .duration(600)
    .delay(500)
    .style('opacity', 1);
  // Set event listenter
  text.on('click', function() {
    str = d3.select(this).text();
    $('#className').val(str);
  });
  text.on('mouseover', function() {
    hideTitle();
    d3.select(this).transition()
      .duration(300)
      .style('fill', 'tomato');

  });
  text.on('mouseout', function() {
    showTitle();
    d3.select(this).transition()
      .duration(300)
      .style('fill', '#DDD');
  });
  title.on('click', function() {
    d3.select('svg').remove();
    renderCloud();
  });
}

function hideTitle() {
  title.transition()
    .duration(500)
    .attr({
      x: -100,
      y: -100
    })
    .style({
      'font-size': '12px',
      'fill': '#DDD'
    });
}

function showTitle() {
  var titleAttr = {
      x: center.x,
      y: center.y,
      "text-anchor": 'middle',
    },
    titleStyle = {
      'fill': '#0d7963',
      'opacity': 1,
      'font-size': 50,
    };
  title.transition()
    .delay(500)
    .duration(250)
    .style(titleStyle)
    .attr(titleAttr);
}

function renderCloud() {
  var w = $('.search').width(),
    h = $('.search').height(),
    margin = {
      left: 15,
      top: 20
    },
    center = {
      x: ~~(w / 2),
      y: ~~(h / 2)
    },
    target = _.sample(textCloudWords, cloudSampleNum);
  d3.layout.cloud().size([w, h])
    .words(target.map(function(d) {
      return {
        text: d,
        size: 10 + Math.random() * 50
      };
    }))
    .rotate(function() {
      return _.sample([-30, 0, 30]);
    })
    .font("Impact")
    .fontSize(function(d) {
      return d.size;
    })
    .on("end", draw)
    .start();

}