var isMobile = function() {
    var mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(window.navigator.userAgent);
};

var clone = function(obj) {
    var c, i;

    if (typeof obj !== 'object' || !obj)
        return obj;

    if ('[object Array]' === Object.prototype.toString.apply(obj)) {
        c = [];
        var len = obj.length;
        for (i = 0; i < len; i++)
            c[i] = clone(obj[i]);
        return c;
    }

    c = {};
    for (i in obj)
        if (obj.hasOwnProperty(i))
            c[i] = clone(obj[i]);
    return c;
};

var prettyNumber = function(v) {
    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

var getDay = function(t) {
    var day = t ? new Date(t) : new Date();
    day.setHours(0, 0, 0, 0);
    return day;
};

var stripTime = function(t) {
    var day = t ? new Date(t) : new Date();
    day.setHours(0, 0, 0, 0);
    return day;
};

module.exports = { isMobile, clone, prettyNumber, stripTime, getDay };
