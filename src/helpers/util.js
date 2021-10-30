var isMobile = function() {
    var mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(window.navigator.userAgent);
};

var prettyNumber = function(v) {
    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

var stripTime = function(t) {
    var day = t ? new Date(t) : new Date();
    day.setHours(0, 0, 0, 0);
    return day;
};

module.exports = { isMobile, clone, prettyNumber, stripTime };
