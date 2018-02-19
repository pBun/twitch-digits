import React, { Component } from 'react';
import { object } from 'prop-types';
import classNames from 'classnames';
import util from '../../../helpers/util';
import { selectors } from '../../../store/modules/snapshot';

import TwitchChart from '../../TwitchChart';
import './styles.css';

class TwitchDigits extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            chart: null,
            chartRootNode: null,
            chartBaseNode: null,
            chartSelectedNode: null,
            chartLevel: 'root'
        };
    };

    componentDidMount() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this.setState({ chart:  new TwitchChart(this.$el, this.selectedCallback.bind(this), this.rootChangeCallback.bind(this))});
        const chartData = this.getChartData(this.props.snapshot);
        if (chartData) this.state.chart.build(chartData);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    };

    componentWillUpdate(nextProps) {
        if (!this.state.chart || nextProps.snapshot == this.props.snapshot) return;
        this.setState({ chartLevel: 'root' });
        this.state.chart.init();
        const chartData = this.getChartData(nextProps.snapshot);
        if (chartData) this.state.chart.build(chartData);
    };

    getChartData(snapshot) {
        if (!snapshot || !snapshot.gameSnapshots || !snapshot.gameSnapshots.length) return null;

        let chartData = {
            type: 'root',
            name: 'summary',
            children: []
        };
        chartData.children = snapshot.gameSnapshots.map(gs => {
            var gameDetails = selectors.getGame(snapshot, gs.gameId);
            var game = {
                type: 'game',
                name: gameDetails.name,
                gameId: gs.gameId,
                viewers: gs.viewers,
                channels: gs.channels
            };

            var gameChannelSnapshots = selectors.getSnapshotGameChannels(snapshot, gs.gameId);
            if (!gameChannelSnapshots.length) {
                game.value = gs.viewers;
                return game;
            }
            game.children = gameChannelSnapshots.map(cs => {
                var channelDetails = selectors.getChannel(snapshot, cs.channelId);
                return {
                    type: 'channel',
                    name: channelDetails.name,
                    channelId: cs.channelId,
                    viewers: cs.viewers,
                    value: cs.viewers
                };
            });

            // add 'other' channel
            var remaining = gs.viewers - game.children.reduce(function(t, c) { return (t.viewers || t) + c.viewers }, 0);
            game.children.push({
                type: 'channel',
                name: '_other',
                value: remaining
            });

            return game;
        });

        // add 'other' game
        var remaining = snapshot.summary.viewers - chartData.children.reduce(function(t, g) { return (t.viewers || t) + g.viewers }, 0);
        chartData.children.push({
            type: 'game',
            name: '_other',
            viewers: remaining,
            value: remaining,
            channels: snapshot.summary.channels - chartData.children.reduce(function(t, g) { return (t.channels || t) + g.channels }, 0)
        });

        return chartData;
    };

    bgImg(v) {
        if (!v) return '';
        return 'url(' + v + ')';
    };

    rootChangeCallback(d) {
        this.setState({
          chartLevel: d.data.type,
          chartRootNode: d.data
        });
    };
  
    selectedCallback(s, b) {
        this.setState({
          chartSelectedNode: (s || {}).data,
          chartBaseNode: (b || {}).data
        });
    };

    handleResize() {
        if (!this.state.chart) return;
        this.state.chart.init();
        const chartData = this.getChartData(this.props.snapshot);
        if (chartData) this.state.chart.build(chartData);
    };

    getNodeDetails(node) {
        if (!node) return {};
        switch (node.type) {
            case 'game':
                return selectors.getGame(this.props.snapshot, node.gameId);
            case 'channel':
                return selectors.getChannel(this.props.snapshot, node.channelId);
            default:
                return {};
        }
    };

    getSelectedData() {
        return this.state.chartSelectedNode || this.state.chartBaseNode || null;
    };

    getSelectedBaseData() {
        var selectedType = this.state.chartSelectedNode && this.state.chartSelectedNode.type;
        return selectedType === 'game' ? this.props.snapshot && this.props.snapshot.summary :
            selectedType === 'channel' ? this.state.chartBaseNode :
            this.props.snapshot || { name: '', viewers: 0 };
    };

    getRootData() {
        var rootType = this.state.chartLevel;
        var rootData = rootType === 'root' ? this.props.snapshot && this.props.snapshot.summary :
            rootType === 'channel' ? this.state.chartRootNode :
            this.props.snapshot;
        return rootData;
    };

    render() {
        const rootData = this.getRootData();
        const selectedData = this.getSelectedData();
        const selectedBaseData = this.getSelectedBaseData();
        const selectedDataDetails = this.getNodeDetails(selectedData);
        
        var innerInfo;
        if (!rootData) {
            innerInfo = null;
        } else if (!selectedData) {
            innerInfo = (
                <div className="inner-info">
                    <div className="stats">
                        <span className="stat">
                            <span className="icon"><svg viewBox="0 0 16 16" height="100%" version="1.1" width="100%" x="0px" y="0px"><path clipRule="evenodd" d="M11,14H5H2v-1l3-3h2L5,8V2h6v6l-2,2h2l3,3v1H11z" fillRule="evenodd"></path></svg></span>
                            <span className="value">{ util.prettyNumber(rootData.viewers || 0) }</span>
                        </span>
                    </div>
                </div>
            );
        } else {
            innerInfo = (
                <div className="inner-info">
                    <span className="title">{ selectedDataDetails.displayName || selectedDataDetails.name }</span>
                    <div className="stats">
                        <span className="stat">{ util.prettyNumber(selectedData.viewers) }</span>
                        <span className="stat">{ util.prettyPercent(selectedData.viewers / selectedBaseData.viewers, 2) }</span>
                    </div>
                </div>
            );
        }
        return ( 
          <div className={classNames('snapshot-chart', 'chart-wrapper', 'level-' + this.state.chartLevel, { 'clickable': this.state.chart && this.state.chart.state.clickable })} ref={(el) => { this.$el = el; }}>
              <div className="explanation" style={ { backgroundImage: this.bgImg(selectedDataDetails.image) } }>
                  <div className="info">
                        {innerInfo}
                  </div>
                  <span className="back-info">click to go back</span>
              </div>
          </div>
        );
    }
};

TwitchDigits.propTypes = { snapshot: object };
TwitchDigits.defaultProps = { snapshot: null };

export default TwitchDigits;
