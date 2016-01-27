"use strict";
var datastorm = datastorm || {};

datastorm.virus = (function(){
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
    .friction(0.1);
    // .on('tick', updatePositions)
    // .on('end', forceEnd);

  var timer;

  var ctx = datastorm.canvas.ctx;

  function init() {
    // elements.svg = d3.select('svg');

    // elements.svg.selectAll('*').remove();

    // elements.svg.append('g').classed('links', true);
    // elements.svg.append('g').classed('nodes', true);

    d3.select('canvas')
      .attr('width', config.width)
      .attr('height', config.height);

    force.size([config.width, config.height]);
  }




  function forceEnd() {
    // updatePositions();
    // updateNetwork();
  }

  function updateNetwork() {
    // console.log('updating network')

    // Clone, otherwise adding nodes whilst iterating is not clever :)
    nodes = _.clone(datastorm.virus.sim.getUsers());
    links = _.clone(datastorm.virus.sim.getLinks());

    // _.each(nodes, function(n) {
    //   console.log(n.x, n.y);
    // });

    force.nodes(nodes)
      .links(links)
      .start();
  }

  function render() {
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, config.width, config.height);



    ctx.globalAlpha = 0.5;

    // Links
    ctx.strokeStyle = 'rgba(200, 200, 255, 0.7)';
    ctx.lineWidth = 0.5;

    _.each(links, function(d) {
      datastorm.canvas.drawLine(d.source.x, d.source.y, d.target.x, d.target.y);
    });

    // // Nodes
    // console.log('render', nodes.length);
    ctx.fillStyle = 'rgba(200,200,255,1)';
    _.each(nodes, function(d) {
      // console.log(d);
      // ctx.fillStyle = colorScale(d.subject * 2);

      var activeMessages = _.filter(d.messages, function(dd) {
        return dd.active;
      });

      var fill = '#ddd';

      var radius = 3;
      if(activeMessages.length > 0) {
        fill = activeMessages[0].color;
        radius = 6;
      }

      ctx.fillStyle = fill;

      datastorm.canvas.drawCircle(d.x, d.y, radius);
    });

    // delay
    // force.stop();

    // console.log('update', links, nodes);

    // Links
    // var u = elements.svg
    //   .select('.links')
    //   .selectAll('line')
    //   .data(links);

    // u.enter()
    //   .append('line')
    //   .style('opacity', 0);

    // u.exit().remove();

    // u
    //   .attr('x1', function(d) {
    //     return d.source.x;
    //   })
    //   .attr('y1', function(d) {
    //     return d.source.y;
    //   })
    //   .attr('x2', function(d) {
    //     return d.target.x;
    //   })
    //   .attr('y2', function(d) {
    //     return d.target.y;
    //   })
    //   .transition()
    //   // .duration(2000)
    //   .style('opacity', 0.2);


    // // Nodes
    // u = elements.svg
    //   .select('.nodes')
    //   .selectAll('circle')
    //   .data(nodes);

    // u.enter()
    //   .append('circle')
    //   .attr('r', 3)
    //   .style('opacity', 0)
    //   .style('fill', '#ddd');

    // u.exit().remove();

    // u
    //   .attr('cx', function(d) {
    //     return d.x;
    //   })
    //   .attr('cy', function(d) {
    //     return d.y;
    //   })
    //   .transition()
    //   // .duration(2000)
    //   .style('opacity', 0.6);



    // if(active)
    //   window.requestAnimationFrame(update);
  }

  function showMessages() {
    elements.svg
      .select('.nodes')
      .selectAll('circle')
      .each(function(d) {
        var activeMessages = _.filter(d.messages, function(dd) {
          return dd.active;
        });

        var fill = '#ddd';

        if(activeMessages.length > 0)
          fill = activeMessages[0].color;

        d3.select(this)
          .style('fill', fill)
          .attr('r', activeMessages.length > 0 ? 6 : 3);

        // var repeatedMessages = _.filter(d.messages, function(dd) {
        //   return dd.originator !== d.id; 
        // });

        // var fill = '#ddd';
        // if(activeMessages.length > 0) {
        //   if(repeatedMessages.length > 0)
        //     fill = 'yellow';
        //   else
        //     fill = 'red';
        // }

        // d3.select(this)
        //   .attr('r', activeMessages.length > 0 ? 6 : 3)
        //   .style('fill', fill);
      });
      // .attr('r', function(d) {
      //   return d.messages.length > 0 ? 6 : 3;
      // })
      // .style('fill', function(d) {
      //   if(d.messages.length === 0)
      //     return '#ddd';
      //   var isRepeating = false;
      //   var length = d.messages.length;
      //   for(var i = 0; i < length; i++) {
      //     if(d.messages[i].originator !== d.id) {
      //       isRepeating = true;
      //       break;
      //     }
      //   }
      //   return isRepeating ? 'yellow' : 'red';
      // });
      // .style('fill', function(d) {
      //   if(d.messages.length > 0)
      //     return '#ddd';
      //   if(d.isRepeatedMessage)
      //     return 'yellow';
      //   return 'red';
      // });
  }

  // function showMessages() {
  //   var messages = datastorm.virus.sim.getMessages();
  //   // console.log(messages);


  //   var userIds = [];
  //   _.each(messages, function(m) {
  //     userIds.push(m.userId);
  //   });
  //   userIds = _.uniq(userIds);

  //   elements.svg
  //     .selectAll('circle')
  //     .style('fill', function(d) {
  //       // console.log(d.id);
  //       return _.has(userIds, d.id) ? 'red' : '#ddd';
  //     })
  //     .attr('r', function(d) {
  //       // console.log(d.id);
  //       return _.has(userIds, d.id) ? 6 : 3;
  //     });


  //   // console.log(userIds);
  // }

  my.init = function(conf) {
    _.assign(config, conf);

    init();


    // timer = setInterval(updateNetwork, 500);
    // update();
    // setInterval(updatePositions, 1000);
    // console.log(width, height);

  };

  my.start = function() {
    // timer = setInterval(showMessages, 100);    

    // updateNetwork();

    datastorm.virus.sim.start();

    setInterval(render, 100);
  }

  my.stop = function() {
    // clearInterval(timer);

    datastorm.virus.sim.stop();
  };

  my.networkUpdate = function() {
    updateNetwork();
  }

  return my;
}());