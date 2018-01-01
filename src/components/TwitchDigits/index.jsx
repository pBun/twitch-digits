import React, { Component } from 'react';
import classNames from 'classnames';
import util from '../../helpers/util';
import api from '../../helpers/twitchPub';
import ForkMe from '../ForkMe/index.jsx';
import ErrorModal from '../ErrorModal/index.jsx';
import ControlPanel from '../ControlPanel/index.jsx';
import WalkingLoader from '../WalkingLoader/index.jsx';
import DayMenu from './DayMenu/index.jsx';
import './styles.css';

class TwitchDigits extends Component {
    
    constructor(props) {
        super(props);
        this.state = { 
            initialized: false,
            loading: false,
            loadingTimeout: null,
            loadingDelay: 250,
            error: null,
            times: [],
            selectedTime: null,
            selectedDay: null,
            now: null,
            snapshot: null,
            controlsOpen: false
        };
    };

    handleControlsToggle() {
        this.setState({controlsOpen: !this.state.controlsOpen})
    };
  
    render() {
        return ( 
            <div className={classNames('twitch-digits', {'initialized': this.state.initialized, 'loading': this.state.loading})}>
                <header className="header">
                    <div className="header-inner">
                        <h1 className="headline"><a className="logo" href="/">twitch digits</a></h1>
                        <h2 className="chart-label">viewership as of { util.prettyRelTime(this.state.selectedTime) }</h2>
                    </div>
                    <ForkMe href="https://github.com/pBun/twitch-digits" />
                </header>
                <main className="main">
                    <ControlPanel toggleText="timeline" open={this.state.controlsOpen} handleToggle={this.handleControlsToggle.bind(this)}>
                        {/*<DayMenu :days="days" :selected="filteredDay" @linkClick="filterDay" />*/}
                        {/*<SnapshotMenu :times="filteredTimes" :selected="selectedTime" @linkClick="refresh" />*/}
                    </ControlPanel>
                </main>
                <WalkingLoader />
                <ErrorModal error={this.state.error} />
            </div>
        );
    }
}

export default TwitchDigits;

//////////////////// END ////////////////////////////////////////

// <template>
// <div class="twitch-digits">
//     <main class="main">
//         <snapshot-chart class="snapshot-chart" :snapshot="snapshot" :class="{ 'visible': (initialized && !loading) }"></snapshot-chart>
//         <control-panel class="control-panel" toggle-text="timeline" :open="controlsOpen" @open="handleControlsState" :class="{ 'visible': initialized }">
//             <day-menu :days="days" :selected="filteredDay" @linkClick="filterDay"></day-menu>
//             <snapshot-menu :times="filteredTimes" :selected="selectedTime" @linkClick="refresh"></snapshot-menu>
//         </control-panel>
//     </main>
// </div>
// </template>

// <script>
// import WalkingLoader from '../WalkingLoader.vue';
// import ErrorModal from '../ErrorModal.vue';
// import ControlPanel from '../ControlPanel.vue';
// import ForkMe from '../ForkMe.vue';
// import SnapshotMenu from './SnapshotMenu.vue';
// import DayMenu from './DayMenu.vue';
// import SnapshotChart from './SnapshotChart.vue';
// export default {
//     data() {
//         return {
//             initialized: false,
//             loading: false,
//             loadingTimeout: null,
//             loadingDelay: 250,
//             error: null,
//             times: [],
//             selectedTime: null,
//             selectedDay: null,
//             now: null,
//             snapshot: null,
//             controlsOpen: false
//         }
//     },
//     computed: {
//         prettyTime(scope) {
//             var t = scope.selectedTime;
//             if (!t) return 'now';
//             var diff = moment().diff(moment(t));
//             var dur = moment.duration(diff);
//             var d = Math.floor(dur.asDays());
//             var h = Math.round(dur.asHours() - d * 24);
//             return (d ? d + 'd ' : '') + (h ? h + 'h' : 'a few minutes') + ' ago';
//         },
//         days(scope) {
//             if (!scope.times || !scope.times.length) return [];
//             var days = scope.times.map(t => util.stripTime(t && t._time));
//             var unique = {};
//             days = days.filter(d => unique.hasOwnProperty(d) ? false : (unique[d] = true));
//             var numDays = Math.min(days.length, 7);
//             return days.slice(days.length - numDays, days.length);
//         },
//         filteredDay(scope) {
//             if (scope.selectedDay) return scope.selectedDay;
//             if (!scope.days || !scope.days.length) return util.stripTime(new Date());
//             var latest = scope.days.reduce((a, b) => Math.max(a, b));
//             return new Date(latest);
//         },
//         filteredTimes(scope) {
//             return scope.times.filter(t => {
//                 return util.stripTime(t._time).getDate() === scope.filteredDay.getDate();
//             });
//         }
//     },
//     methods: {
//         startLoading() {
//             var scope = this;
//             this.loadingTimeout = setTimeout(() => scope.loading = true, scope.loadingDelay);
//         },
//         stopLoading() {
//             clearTimeout(this.loadingTimeout);
//             this.loading = false
//         },
//         refresh(time) {
//             this.controlsOpen = false;
//             return this.loadSnapshot(time)
//                 .then(() => this.loadTimes());
//         },
//         setNow(s) {
//             this.now = {
//                 'viewers': s.viewers,
//                 'channels': s.channels
//             };
//         },
//         loadTimes() {
//             this.startLoading();
//             this.error = null;
//             return api.get('snapshot/times')
//                 .then(t => {
//                     t.push(this.now);
//                     this.times = t;
//                 })
//                 .catch(err => this.error = err)
//                 .then(() => this.stopLoading());
//         },
//         loadSnapshot(time) {
//             this.startLoading();
//             this.error = null;
//             this.selectedTime = time;
//             var endpoint = time ? 'snapshot/' + time : 'snapshot';
//             return api.get(endpoint)
//                 .then(s => {
//                     if (!time) this.setNow(s);
//                     this.snapshot = s
//                 })
//                 .catch(err => this.error = err)
//                 .then(() => this.stopLoading());
//         },
//         filterDay(day) {
//             this.selectedDay = day;
//         },
//         handleControlsState(state) {
//             this.controlsOpen = state;
//         }
//     },
//     created() {
//         this.refresh().then(() => this.initialized = true);
//     },
//     components: { SnapshotChart, WalkingLoader, ControlPanel, ErrorModal, SnapshotMenu, DayMenu, ForkMe }
// }
// </script>
