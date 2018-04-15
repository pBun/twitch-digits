import React, { Component } from 'react';
import { number } from 'prop-types';
import classNames from 'classnames';
import util from '../../lib/util';
import * as selectors from '../../store/modules/summarySnapshots/selectors';
import ReactTooltip from 'react-tooltip';
import ForkMe from '../ForkMe/index.jsx';
import ErrorModal from '../ErrorModal/index.jsx';
import ControlPanel from '../ControlPanel/index.jsx';
import WalkingLoader from '../WalkingLoader/index.jsx';
import DayMenu from './DayMenu/index.jsx';
import SnapshotMenu from './SnapshotMenu/index.jsx';
import SnapshotChart from './SnapshotChart/index.jsx';
import './styles.css';

const isMobile = util.isMobile();

class TwitchDigits extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialized: false,
            loading: false,
            error: null,
            selectedTime: null,
            selectedDay: null,
            now: null,
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

        // slight delay before we start loading
        this.loadingTimeout = setTimeout(() => this.setState({ loading: true, error: null }), this.props.loadingDelay);

        let state = {};
        return this.props.loadSnapshot(time)
            .then(() => {
                if (!time) state.now = { ...this.props.snapshot.summary, _time: time };
                return this.props.loadSummaries();
            })
            .catch(err => {
                var error = typeof err === 'object' ? 'API CODE: ' + err.code : err.toString();
                state.error = error;
            })
            .then(() => {
                clearTimeout(this.loadingTimeout);
                state.initialized = true;
                state.loading = false;
                this.setState(state);
            });
    };

    handleControlsToggle() {
        this.setState({controlsOpen: !this.state.controlsOpen});
    };

    handleDayLink(d) {
        this.setState({selectedDay: d});
    };

    handleSnapshotLink(s, e) {

        // clear anchor highlight
        var event = document.createEvent('HTMLEvents');
        event.initEvent('blur', true, false);
        e.target.dispatchEvent(event);

        // update selected time and close drawer if desktop
        this.setState({
            selectedTime: s,
            controlsOpen: isMobile
        });
        this.refresh(s);
    };

    handleErrorClose() {
      this.setState({ error: null });
    };

    handleErrorRefresh() {
      this.refresh();
    };

    getSelectedDay(days) {
        if (this.state.selectedDay) return this.state.selectedDay;
        if (!days || !days.length) return util.stripTime(new Date());
        var latest = days.reduce((a, b) => Math.max(a, b));
        return new Date(latest);
    };

    render() {
        const summaries = [ ...this.props.summaries ];
        if (this.state.now) summaries.push(this.state.now);
        const days = selectors.getDays(summaries);
        const day = this.getSelectedDay(days);
        const times = selectors.getDayTimes(summaries, day);
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
                    <SnapshotChart snapshot={this.props.snapshot} />
                    <ControlPanel toggleText="timeline" open={this.state.controlsOpen} handleToggle={this.handleControlsToggle.bind(this)}>
                        <DayMenu days={days} selected={day} handleLink={this.handleDayLink.bind(this)} />
                        <SnapshotMenu times={times} selected={this.state.selectedTime} handleLink={this.handleSnapshotLink.bind(this)} />
                    </ControlPanel>
                </main>
                <WalkingLoader />
                <ErrorModal error={this.state.error} onRefresh={this.handleErrorRefresh.bind(this)} onClose={this.handleErrorClose.bind(this)} />
                <ReactTooltip place="top" border={true} effect="solid" />
            </div>
        );
    }
};

TwitchDigits.propTypes = { loadingDelay: number };
TwitchDigits.defaultProps = { loadingDelay: 250 };

export default TwitchDigits;
