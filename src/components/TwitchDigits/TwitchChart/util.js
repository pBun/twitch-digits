var isMobile = function() {
    var mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(window.navigator.userAgent);
};

var numLevels = function(d) {
    if (!d || !d.games) return 0;
    var numStreams = d.games.reduce(function(t, g) {
      return t + (g.streams ? g.streams.length : 0);
    }, 0);
    return numStreams ? 2 : 1;
};

var formatChartData = function(apiData, hasChannels) {
    var d = apiData;
    var hasStreams = numLevels(apiData) > 1;
    d.name = 'summary';
    d.type = 'root';
    d.children = d.games.map(g => {
      g.type = 'game';
      if (!hasStreams) {
        g.value = g.viewers;
        return g;
      }
      g.children = (g.streams || []).map(s => {
        s.type = 'channel';
        s.value = s.viewers;
        return s;
      });

      // add 'other' channel
      g.children = g.children || [];
      var remaining = g.viewers - g.children.reduce(function(t, c) { return (t.viewers || t) + c.viewers }, 0);
      g.children.push({
        type: 'channel',
        name: '_other',
        viewers: remaining,
        value: remaining
      })
      delete g.streams;
      return g;
    });

    // add 'other' game
    var remaining = d.viewers - d.children.reduce(function(t, g) { return (t.viewers || t) + g.viewers }, 0);
    d.children.push({
      type: 'game',
      name: '_other',
      viewers: remaining,
      value: remaining,
      channels: d.channels - d.children.reduce(function(t, g) { return (t.channels || t) + g.channels }, 0)
    });
    delete d.games;
    return d;
};

module.exports = { isMobile, clone, formatChartData, numLevels };
