var isMobile = function() {
    var mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(window.navigator.userAgent);
};

function countNestedChildren(chartData, count) {
	count = count || 0;
	if (!chartData || !chartData.children) return count;
	return chartData.children.reduce(function(t, c) {
		return Math.max(t, countNestedChildren(c, count + 1));
    }, 0);
};

module.exports = { isMobile, countNestedChildren };
