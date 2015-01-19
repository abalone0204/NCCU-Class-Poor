d3.select("button").on("click", function() {
  d3.csv('class.csv', function(d) {
    var data = d, 
        filter = {
          className: "",
          classification: ""
        };
    console.log($("input").val());
  });
});