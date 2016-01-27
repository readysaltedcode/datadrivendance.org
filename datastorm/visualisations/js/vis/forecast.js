"use strict";
var datastorm = datastorm || {};
datastorm.vis = datastorm.vis || {};

datastorm.vis.forecast = (function(){
  var my = {};

  var width = 1200, height = 800;

  var locations = [];

  var startTs; // start time of animation. Used to calculate elapsed time
  var elapsedTs;
  var durationTs = 240000; // full length of animation
  var animationActive = true;


  var sampleScale = d3.scale.linear().domain([0, durationTs]).range([0, 35]);
  var colour = d3.scale.linear().domain([-1, 5, 16, 22]).range(['lightblue', 'white', 'orange', 'red']).clamp(true);
  var radiusScale = d3.scale.linear().domain([0, 100]).range([1, 30]);
  var opacityScale = d3.scale.linear().domain([0, 100]).range([0, 1]);

  var drawProbability = d3.scale.linear().domain([0, 100]).range([0, 0.05]);

  var ctx = datastorm.canvas.ctx;

  var projection = d3.geo.orthographic()
    .scale(8800)
    .translate([850, 7550])
    .clipAngle(90)
    .precision(.1);



  function initialiseData(json) {
    locations = json;
  }

  function doFrame() {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, width, height);

    elapsedTs = Date.now() - startTs;
 
    render();

    // if(elapsedTs > durationTs)
    //   animationActive = false;

    // if(animationActive)
    //   window.requestAnimationFrame(doFrame);
  }

  function render() {
    // console.log('render');

    ctx.globalAlpha = 0.1;

    var sampleIndex = Math.floor(sampleScale(elapsedTs));

    _.each(locations, function(l) {
  
      if(Math.random() > drawProbability(l.speed[sampleIndex]))
        return;

      ctx.globalAlpha = opacityScale(l.speed);

      ctx.fillStyle = colour(l.temp[sampleIndex]);

      // console.log(l);
      var pt = projection([l.lon, l.lat]);
      datastorm.canvas.drawCircle(pt[0], pt[1], radiusScale(l.speed[sampleIndex]));

    });


  }

  my.start = function() {


    d3.json('data/forecast-old.json', function(err, json) {
      // console.log(json);

      initialiseData(json);

      startTs = Date.now();

      setInterval(doFrame, 100);
      // window.requestAnimationFrame(doFrame);
    });
  }

  return my;
}());

