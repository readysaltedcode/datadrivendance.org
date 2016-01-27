"use strict";
var datastorm = datastorm || {};

datastorm.opener = (function(){
  var my = {};

  var width = document.body.clientWidth;
  var height = document.body.clientHeight;

  var color = d3.scale.linear().domain([0, 1]).range(['white', 'blue']);


  var ctx = datastorm.canvas.ctx;

  var intervalTimer;


  function doFrame() {
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, width, height);


    var x = Math.random() * width;
    var y = Math.random() * height;

    ctx.fillStyle = color(Math.random());
    datastorm.canvas.drawCircle(x, y, 3);
  }


  my.init = function() {};

  my.start = function() {
    intervalTimer = setInterval(doFrame, 60);
  };

  my.stop = function() {
    animationActive = false;
    clearInterval(intervalTimer);
  }

  return my;
}());

