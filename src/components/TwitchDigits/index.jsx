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
        this.refresh().then(() => this.setInitialized(true));
    };

    componentDidUpdate() {
        ReactTooltip.rebuild();
    };

    refresh(time) {
        return this.loadSnapshot(time)
            .then(() => this.loadTimes());
    };

    loadSnapshot(time) {
        const isMobile = util.isMobile();
        this.startLoading();
        if (!isMobile) ReactTooltip.hide();
        this.setState({selectedTime: time, controlsOpen: isMobile});
        var endpoint = time ? 'snapshot/' + time : 'snapshot';
        return api.get(endpoint)
            .then(s => {
                let state = {
                    snapshot: s,
                    loading: false
                };
                if (!time) state.now = s;
                this.setState(state);
            })
            .catch(err => {
                this.setState({ error: err, loading: false });
            })
            .then(() => this.stopLoading());
    };

    loadTimes() {
        this.startLoading();
        return api.get('snapshot/times')
            .then(t => {
                t.push(this.state.now);
                this.setState({ times: t, loading: false });
            })
            .catch(err => {
                this.setState({ error: err, loading: false });
            })
            .then(() => this.stopLoading());
    };

    startLoading() {
        this.loadingTimeout = setTimeout(() => this.setState({ error: null, loading: true }), this.props.loadingDelay);
    };

    stopLoading() {
        if (this.state.loading) this.setState({loading: false});
        clearTimeout(this.loadingTimeout);
    };

    setInitialized(initialized) {
        this.setState({initialized: initialized});
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
            <div className={classNames('twitch-digits', {'initialized': this.state.initialized, 'loading': this.state.loading})}>
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
                <ReactTooltip place="top" border="true" effect="solid" />
            </div>
        );
    }
};

TwitchDigits.propTypes = { loadingDelay: number };
TwitchDigits.defaultProps = { loadingDelay: 250 };

export default TwitchDigits;
