import moment from 'moment';

var Util = {};

Util.isMobile = function() {
    var mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(window.navigator.userAgent);
};

Util.clone = function(obj) {
    var c, i;

    if (typeof obj !== 'object' || !obj)
        return obj;

    if ('[object Array]' === Object.prototype.toString.apply(obj)) {
        c = [];
        var len = obj.length;
        for (i = 0; i < len; i++)
            c[i] = Util.clone(obj[i]);
        return c;
    }

    c = {};
    for (i in obj)
        if (obj.hasOwnProperty(i))
            c[i] = Util.clone(obj[i]);
    return c;
};

Util.prettyNumber = function(v) {
    if (!v) return v;
    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

Util.stripTime = function(t) {
    var day = t ? new Date(t) : new Date();
    day.setHours(0, 0, 0, 0);
    return day;
};

Util.prettyDay = function(v) {
    var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var day = v.getDay();
    var isToday = Util.stripTime(new Date()).getDate() === v.getDate();
    return !isToday ? weekDays[v.getDay()] : 'Today';
};

Util.prettyDate = function(v) {
    var d = new Date(v);
    return d.toLocaleDateString();
};

Util.prettyRelTime = function(v) {
    if (!v) return 'now';
    var diff = moment().diff(moment(v));
    var dur = moment.duration(diff);
    var d = Math.floor(dur.asDays());
    var h = Math.round(dur.asHours() - d * 24);
    return (d ? d + 'd ' : '') + (d || h ? h + 'h' : 'a few minutes') + ' ago';
};

Util.prettyPercent = function(v, decimals) {
    if (typeof v !== 'number') return v;
    return (v * 100).toFixed(decimals || 0) + '%';
};

Util.prettySimpleTime = function(v) {
    if (!v) return '';
    var d = new Date(v);
    d = d.getHours();
    var afternoon = (d >= 12);
    d = d > 12 ? d - 12 : d || 12;
    return d + (afternoon ? ' PM' : ' AM');
};

export default Util;
