"use strict";
var datastorm = datastorm || {};

datastorm.network = (function(){
  var my = {};

  var elements = {};

  var width, height;
  var active = true;

  var config = {};

  var nodes = [], links = [];

  var force = d3.layout.force()
    .charge(-800)
    .linkDistance(50)
    .linkStrength(function(d) {
      return d.strength;
    })
    .gravity(0.01)
    .friction(0.1)
    .on('tick', updatePositions);

  // var timer;

  var colorScale = d3.scale.category20();

  function init() {
    elements.svg = d3.select('svg');
    force.size([config.width, config.height]);
  }

  function updateNetwork() {
    nodes = _.clone(datastorm.network.sim.getUsers());
    links = _.clone(datastorm.network.sim.getLinks());

    force.nodes(nodes)
      .links(links)
      .start();
  }

  function updatePositions() {
    // Links
    var u = elements.svg
      .selectAll('line')
      .data(links);

    u.enter()
      .append('line')
      .style('opacity', 0);

    u.exit().remove();

    u
      .attr('x1', function(d) {
        return d.source.x;
      })
      .attr('y1', function(d) {
        return d.source.y;
      })
      .attr('x2', function(d) {
        return d.target.x;
      })
      .attr('y2', function(d) {
        return d.target.y;
      })
      .transition()
      .style('opacity', 0.2);


    // Nodes
    u = elements.svg
      .selectAll('circle')
      .data(nodes);

    u.enter()
      .append('circle')
      .attr('r', 3)
      .style('opacity', 0)
      .style('fill', function(d) {
        return colorScale(d.subject * 2);
      });

    u.exit().remove();

    u
      .attr('cx', function(d) {
        return d.x;
      })
      .attr('cy', function(d) {
        return d.y;
      })
      .transition()
      .style('opacity', 1);
  }


  my.init = function(conf) {
    _.assign(config, conf);

    init();

    updateNetwork();
  };

  my.stop = function() {
    // clearInterval(timer);

    datastorm.network.sim.stop();
  };

  my.networkUpdate = function() {
    updateNetwork();
  }

  return my;
}());