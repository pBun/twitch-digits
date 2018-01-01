require('./style.css');
import * as d3 from 'd3';
import util from './util';
import colorbrewer from './colorbrewer';

var TwitchChart = function(el, selectedCallback, rootChangeCallback) {
  this.selectedCallback = typeof selectedCallback === 'function' ? selectedCallback : function(cur, fb) {};
  this.rootChangeCallback = typeof rootChangeCallback === 'function' ? rootChangeCallback : function(d) {};
  this.state = {};
  this.chart = {};
  this.isMobile = util.isMobile();
  this.init(el);
};

TwitchChart.prototype.init = function(el) {
  var chart = this.chart;

  chart.wrapper = el || chart.wrapper;

  var parentEl = chart.wrapper.parentNode;
  var parentDim = Math.min(parentEl.offsetWidth, parentEl.offsetHeight);
  chart.width = parentDim;
  chart.height = parentDim;
  chart.radius = parentDim / 2;

  // set up x / y scale vars for zoom
  chart.x = d3.scaleLinear()
    .range([0, 2 * Math.PI]);
  chart.y = d3.scaleSqrt()
    .range([0, chart.radius]);

  chart.colors = d3.scaleOrdinal(d3.schemeCategory10);

  chart.arc = d3.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, chart.x(d.x0))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, chart.x(d.x1))); })
    .innerRadius(function(d) { return Math.max(0, chart.y(d.y0)); })
    .outerRadius(function(d) { return Math.max(0, chart.y(d.y1)); });

  chart.visWrapper = chart.visWrapper || d3.select(chart.wrapper).append('svg');
  chart.visWrapper
      .attr('class', 'chart')
      .attr('width', chart.width)
      .attr('height', chart.height);

  chart.vis = chart.vis || chart.visWrapper.append('g');
  chart.vis
      .attr('transform', 'translate(' + chart.width / 2 + ',' + chart.height / 2 + ')')
      .selectAll('path')
      .remove();

  return this;

};

TwitchChart.prototype.build = function(chartData) {
  var chart = this.chart;

  // Determine if we have children to click
  var hasChannels = util.numLevels(chartData) > 1;

  // Chat becomes clickable if there are channels
  this.state.clickable = hasChannels;
  chart.visWrapper.classed('clickable', this.state.clickable);

  // Keep track of current root
  this.state.root = util.formatChartData(chartData);

  chart.partition = d3.partition();

  var node = d3.hierarchy(this.state.root);
  node.sum(function(d) { return d.value; })
      .sort(function(a, b) {
        return a.data.name === '_other' ? 1 :
          b.data.name === '_other' ? -1 :
          b.data.viewers - a.data.viewers;
      });

  // set domain of colors scale based on data
  var uniqueNames = (function(a) {
      var output = [];
      a.data.children.forEach(function(d) {
          if (output.indexOf(d.name) === -1) {
              output.push(d.name);
          }
      });
      return output;
  })(node);
  chart.colors.domain(uniqueNames);

  chart.path = chart.vis
    .selectAll('path')
    .data(chart.partition(node).descendants());

  // clear existing chart if there is one
  chart.path.exit()
    .remove();

  chart.path.enter()
    .append('path')
    .attr('d', chart.arc)
    .attr('display', function(d) { return d.depth ? null : 'none'; })
    .attr('class', function(d) { return d.data.type + ' ' + d.data.type + '_' + JSON.stringify(d.data.name).replace( /\W/g , '').toLowerCase(); })
    .style('fill', function(d) { return chart.colors(d.data.type === 'channel' ? d.parent.data.name : d.data.name); })
    .on('mouseover', this.mouseoverHandler.bind(this))
    .on('click', this.clickHandler.bind(this));


  chart.vis.on('mouseleave', this.mouseleaveHandler.bind(this));

  return this;
};

TwitchChart.prototype.setCurrentNode = function(d) {
  var chart = this.chart;

  // remove node instead of attempting to set to undefined
  if (!d) {
    this.removeCurrentNode();
    return;
  }

  // Update current chart data
  if (this.state.current !== d) this.state.current = d;
  this.state.currentGame = (d.data.type === 'channel') ? d.parent : d;

  // Then highlight ancestors/
  var ancestors = d.ancestors();
  var descendants = d.descendants();
  chart.visWrapper
    .classed('active', true)
    .selectAll('path')
      .classed('current', false)
      .filter(function(node) {
        var isDirectlyActive = node === d;
        var isDescendant = descendants.indexOf(node) >= 0;
        var isAncestor = ancestors.indexOf(node) >= 0;
        var isActive = isDirectlyActive || isDescendant || isAncestor;
        return isActive;
      })
      .classed('current', true);
};

TwitchChart.prototype.removeCurrentNode = function() {
  var chart = this.chart;

  // If we are zoomed, default to current game
  if (this.state.zoomed) {
    this.state.current = this.state.currentGame;
    return;
  }

  // Unset current chart data
  this.state.current = null;
  this.state.currentGame = null;

  // Transition each segment to full opacity and then reactivate it.
  chart.visWrapper
    .classed('active', false)
    .selectAll('path')
      .classed('current', false);
};

// Fade all but the current sequence
TwitchChart.prototype.mouseoverHandler = function(d) {
  this.setCurrentNode(d);
  this.selectedCallback(this.state.current, this.state.currentGame);
}

// Restore everything to full opacity when moving off the visualization.
TwitchChart.prototype.mouseleaveHandler = function(d) {
  this.removeCurrentNode();
  this.selectedCallback(this.state.current, this.state.currentGame);
}

TwitchChart.prototype.clickHandler = function(d) {
  var chart = this.chart;

  if (!this.state.clickable) return;

  if (util.isMobile()) {

    // double tap for desktop action
    if ((d.data.type === 'channel' || d.data.type === 'game') && d !== chart.activeMobile) {
      chart.activeMobile = d;
      return;
    }

  }

  if (d.data.type === 'channel') {
    window.open(d.data.url);
    return;
  }

  var zoomNode = this.state.root = this.state.root === d && d.parent ? d.parent : d;
  var zooming = zoomNode.data.type != 'root';
  clearTimeout(chart.zoomTimeout);
  this.state.zoomed = zooming;
  chart.zoomTimeout = setTimeout(function() {
    chart.visWrapper
      .classed('zoomed', zooming);
  }, zooming ? 0 : 800);
  chart.visWrapper
    .transition()
    .duration(1000)
    .tween('scale', function() {
      var xd = d3.interpolate(chart.x.domain(), [zoomNode.x0, zoomNode.x1]),
          yd = d3.interpolate(chart.y.domain(), [zoomNode.y0, 1]);
      return function(t) { chart.x.domain(xd(t)); chart.y.domain(yd(t)); };
    })
    .selectAll('path')
    .attrTween('d', function(d) { return function() { return chart.arc(d); }; });

  this.rootChangeCallback(zoomNode)
}


export default TwitchChart;
