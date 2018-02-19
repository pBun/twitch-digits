import util from '../../../helpers/util';

function getDays(state) {
    var days = state.map(t => util.stripTime(t && t._time));
    var unique = {};
    days = days.filter(d => unique.hasOwnProperty(d) ? false : (unique[d] = true));
    var numDays = Math.min(days.length, 7);
    return days.slice(days.length - numDays, days.length);
};

function getDayTimes(state, day) {
    let dayTimes = state.filter(t => {
        return util.stripTime(t._time).getTime() === day.getTime();
    });
    return dayTimes;
};

export default {
	getDays,
	getDayTimes
};