<template>
<div class="twitch-digits">
    <header class="header">
        <div class="header-inner">
            <h1 class="headline"><a class="logo" href="/">twitch digits</a></h1>
            <h2 class="chart-label">viewership as of {{ prettyTime }}</h2>
        </div>
        <fork-me href="https://github.com/pBun/twitch-digits"></fork-me>
    </header>
    <main class="main">
        <snapshot-chart class="snapshot-chart" :snapshot="snapshot" :class="{ 'visible': (initialized && !loading) }"></snapshot-chart>
        <control-panel class="control-panel" toggle-text="timeline" :open="controlsOpen" @open="handleControlsState" :class="{ 'visible': initialized }">
            <day-menu :days="days" :selected="filteredDay" @linkClick="filterDay"></day-menu>
            <snapshot-menu :times="filteredTimes" :selected="selectedTime" @linkClick="refresh"></snapshot-menu>
        </control-panel>
    </main>
    <walking-loader class="loader" :class="{ 'visible': (!initialized || loading) }"></walking-loader>
    <error-modal :error="error" :class="{ 'visible': error }"></error-modal>
</div>
</template>

<script>
import util from '../../helpers/util';
import api from '../../helpers/twitchPub';
import moment from 'moment';
import WalkingLoader from '../WalkingLoader.vue';
import ErrorModal from '../ErrorModal.vue';
import ControlPanel from '../ControlPanel.vue';
import ForkMe from '../ForkMe.vue';
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
            snapshot: null,
            controlsOpen: false
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
            days = days.filter(d => unique.hasOwnProperty(d) ? false : (unique[d] = true));
            var numDays = Math.min(days.length, 7);
            return days.slice(days.length - numDays, days.length);
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
            this.controlsOpen = false;
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
        },
        handleControlsState(state) {
            this.controlsOpen = state;
        }
    },
    created() {
        this.refresh().then(() => this.initialized = true);
    },
    components: { SnapshotChart, WalkingLoader, ControlPanel, ErrorModal, SnapshotMenu, DayMenu, ForkMe }
}
</script>

<style>
.twitch-digits {
    height: 100%;
}
.twitch-digits .main {
    height: calc(85% - 2em - 20px);
    margin: 0 20px;
    position: relative;
}

/* header */
.twitch-digits .header {
    position: relative;
    text-align: center;
    height: 15%;
}
.twitch-digits .header .header-inner {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.twitch-digits .header .logo {
    display: inline-block;
    font-size: 3.5em;
    font-weight: 100;
    line-height: 1em;
    letter-spacing: -0.05em;
    border-bottom: none;
    margin-bottom: 0.075em;
}
.twitch-digits .header .chart-label {
    letter-spacing: 0.025em;
}
.twitch-digits .fork-me {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    max-width: 25%;
}

/* loader */
.twitch-digits .loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
}
.twitch-digits .loader.visible {
    display: block;
}

/* error */
.twitch-digits .error-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: none;
}
.twitch-digits .error-modal.visible {
    display: block;
}

/* control panel */
.twitch-digits .control-panel {
    opacity: 0;
    transition: 0.3s opacity;
}
.twitch-digits .control-panel.visible {
    opacity: 1;
}
.twitch-digits .control-content {
    font-size: 0.7em;
}
.twitch-digits .snapshot-menu {
    position: absolute;
    top: 2.3em;
    bottom: 0;
    left: 0;
    right: 0;
}

/* chart */
.twitch-digits .snapshot-chart {
    opacity: 0;
    transition: 0.3s opacity;
}
.twitch-digits .snapshot-chart.visible {
    opacity: 1;
}

/* responsive */
@media (max-width: 480px) {
    .twitch-digits .header .logo {
        font-size: 2.5em;
    }
}

</style>
