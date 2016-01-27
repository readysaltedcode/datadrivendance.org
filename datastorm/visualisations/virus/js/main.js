(function(){

  var wrapper = d3.select('.wrapper');
  width = wrapper.node().clientWidth;
  height = wrapper.node().clientHeight;

  datastorm.virus.sim.init({
    width: width,
    height: height
  });
  datastorm.virus.init({
    width: width,
    height: height
  });

  datastorm.virus.start();

})();