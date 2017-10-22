<template>
<div class="twitch-digits" :class="{ 'loading': loading || error }">
    <div class="twitch-digits-main">
        <h2 class="chart-label">viewership as of {{ prettyTime }}</h2>
        <div class="snapshot-chart-wrapper">
            <snapshot-chart :snapshot="snapshot"></snapshot-chart>
        </div>
        <day-menu :days="days" :selected="filteredDay" @linkClick="filterDay"></day-menu>
    </div>
    <snapshot-menu :times="filteredTimes" :selected="selectedTime" @linkClick="refresh"></snapshot-menu>
    <walking-loader class="loader" :class="{ 'visible': (!initialized || loading) }"></walking-loader>
    <error-modal :error="error"></error-modal>
</div>
</template>

<script>
import util from '../../helpers/util';
import api from '../../helpers/twitchPub';
import moment from 'moment';
import WalkingLoader from './WalkingLoader.vue';
import ErrorModal from './ErrorModal.vue';
import SnapshotMenu from './SnapshotMenu.vue';
import DayMenu from './DayMenu.vue';
import SnapshotChart from './SnapshotChart.vue';
export default {
    data() {
        return {
            initialized: false,
            loading: false,
            error: null,
            times: [],
            selectedTime: null,
            selectedDay: null,
            now: null,
            snapshot: null
        }
    },
    computed: {
        prettyTime(scope) {
            var t = scope.selectedTime;
            if (!t) return 'now';
            var diff = moment().diff(moment(t));
            var dur = moment.duration(diff);
            var d = Math.floor(dur.asDays());
            var h = Math.round(dur.asHours() - d * 24);
            return (d ? d + 'd ' : '') + (h ? h + 'h' : 'a few minutes') + ' ago';
        },
        days(scope) {
            if (!scope.times || !scope.times.length) return [];
            var days = scope.times.map(t => util.getDay(t._time));
            var unique = {};
            return days.filter(d => unique.hasOwnProperty(d) ? false : (unique[d] = true));
        },
        filteredDay(scope) {
            if (scope.selectedDay) return scope.selectedDay;
            return scope.days && scope.days.length && scope.days[scope.days.length - 1] || util.stripTime(new Date());
        },
        filteredTimes(scope) {
            return scope.times.filter(t => {
                return util.stripTime(t._time).getDate() === scope.filteredDay.getDate();
            });
        }
    },
    methods: {
        refresh(time) {
            return this.loadSnapshot(time)
                .then(() => this.loadTimes());
        },
        setNow(s) {
            this.now = {
                'viewers': s.viewers,
                'channels': s.channels
            };
        },
        loadTimes() {
            this.loading = true;
            this.error = null;
            return api.get('snapshot/times')
                .then(t => {
                    t.push(this.now);
                    this.times = t;
                }, err => this.error = err)
                .then(() => this.loading = false);
        },
        loadSnapshot(time) {
            this.loading = true;
            this.error = null;
            this.selectedTime = time;
            var endpoint = time ? 'snapshot/' + time : 'snapshot';
            return api.get(endpoint)
                .then(s => {
                    if (!time) this.setNow(s);
                    this.snapshot = s
                }, err => this.error = err)
                .then(() => this.loading = false);
        },
        filterDay(day) {
            this.selectedDay = day;
        }
    },
    created() {
        this.refresh().then(() => this.initialized = true);
    },
    components: { SnapshotChart, WalkingLoader, ErrorModal, SnapshotMenu, DayMenu }
}
</script>

<style>
.twitch-digits {
    height: 100%;
}
.twitch-digits .chart-label {
    margin-bottom: 1em;
    letter-spacing: 0.025em;
}
.twitch-digits .day-menu {
    margin-top: 0.5em;
}
.twitch-digits .error-modal {
    display: none;
}
.twitch-digits .error-modal.visible {
    display: block;
}
.twitch-digits .twitch-digits-main {
    opacity: 1;
    transition: 0.3s opacity;
    height: 100%;
    position: relative;
}
.twitch-digits.loading .twitch-digits-main {
    opacity: 0;
}
.twitch-digits .snapshot-chart-wrapper {
    height: 80%;
}
.twitch-digits .loader {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.twitch-digits .loader.visible {
    display: block;
}
</style>
