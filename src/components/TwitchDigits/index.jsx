import React, { Component } from 'react';
import { number } from 'prop-types';
import classNames from 'classnames';
import util from '../../helpers/util';
import api from '../../helpers/twitchPub';
import ReactTooltip from 'react-tooltip';
import ForkMe from '../ForkMe/index.jsx';
import ErrorModal from '../ErrorModal/index.jsx';
import ControlPanel from '../ControlPanel/index.jsx';
import WalkingLoader from '../WalkingLoader/index.jsx';
import DayMenu from './DayMenu/index.jsx';
import SnapshotMenu from './SnapshotMenu/index.jsx';
import SnapshotChart from './SnapshotChart/index.jsx';
import './styles.css';

class TwitchDigits extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            initialized: false,
            loading: false,
            loadingTimeout: null,
            error: null,
            times: [],
            selectedTime: null,
            selectedDay: null,
            now: null,
            snapshot: null,
            controlsOpen: false
        };
    };

    componentDidMount() {
        this.refresh();
    };

    componentDidUpdate() {
        ReactTooltip.rebuild();
    };

    refresh(time) {

        // set loading state
        this.setLoadingState(time);

        // get api data and update state
        var state = {};
        return api.get(time ? 'snapshot/' + time : 'snapshot')
            .then(snapshot => {
                state.snapshot = snapshot;
                if (!time) state.now = snapshot;
                return api.get('snapshot/times');
            })
            .then(times => {
                times.push(state.now || this.state.now);
                state.times = times;
            })
            .catch(err => {
                state.error = err.toString();
            })
            .then(() => {
                clearTimeout(this.loadingTimeout);
                state.initialized = true;
                state.loading = false;
                console.log(state);
                this.setState(state);
            });
    };

    setLoadingState(time) {
        this.loadingTimeout = setTimeout(() => this.setState({ loading: true }), this.props.loadingDelay);
        const isMobile = util.isMobile();
        if (!isMobile) ReactTooltip.hide();
        var state = {
            error: null,
            selectedTime: time,
            controlsOpen: isMobile
        };
        this.setState(state);
    };

    handleControlsToggle() {
        this.setState({controlsOpen: !this.state.controlsOpen});
    };

    handleDayLink(d) {
        this.setState({selectedDay: d});
    };

    handleSnapshotLink(s, e) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('blur', true, false);
        e.target.dispatchEvent(event);
        this.refresh(s);
    };

    getDays() {
        if (!this.state.times || !this.state.times.length) return [];
        var days = this.state.times.map(t => util.stripTime(t && t._time));
        var unique = {};
        days = days.filter(d => unique.hasOwnProperty(d) ? false : (unique[d] = true));
        var numDays = Math.min(days.length, 7);
        return days.slice(days.length - numDays, days.length);
    };

    getSelectedDay(days) {
        if (this.state.selectedDay) return this.state.selectedDay;
        if (!days || !days.length) return util.stripTime(new Date());
        var latest = days.reduce((a, b) => Math.max(a, b));
        return new Date(latest);
    };

    getDateTimes(date) {
        return this.state.times.filter(t => {
            return util.stripTime(t._time).getDate() === date;
        });
    };
  
    render() {
        const days = this.getDays();
        const day = this.getSelectedDay();
        const times = this.getDateTimes(day.getDate());
        ReactTooltip.rebuild();
        return ( 
            <div className={classNames('twitch-digits', {'initialized': this.state.initialized, 'loading': this.state.loading, 'error': !!this.state.error })}>
                <header className="header">
                    <div className="header-inner">
                        <h1 className="headline"><a className="logo" href="/">twitch digits</a></h1>
                        <h2 className="chart-label">viewership as of { util.prettyRelTime(this.state.selectedTime) }</h2>
                    </div>
                    <ForkMe href="https://github.com/pBun/twitch-digits" />
                </header>
                <main className="main">
                    <SnapshotChart snapshot={this.state.snapshot} />
                    <ControlPanel toggleText="timeline" open={this.state.controlsOpen} handleToggle={this.handleControlsToggle.bind(this)}>
                        <DayMenu days={days} selected={day} handleLink={this.handleDayLink.bind(this)} />
                        <SnapshotMenu times={times} selected={this.state.selectedTime} handleLink={this.handleSnapshotLink.bind(this)} />
                    </ControlPanel>
                </main>
                <WalkingLoader />
                <ErrorModal error={this.state.error} />
                <ReactTooltip place="top" border={true} effect="solid" />
            </div>
        );
    }
};

TwitchDigits.propTypes = { loadingDelay: number };
TwitchDigits.defaultProps = { loadingDelay: 250 };

export default TwitchDigits;
