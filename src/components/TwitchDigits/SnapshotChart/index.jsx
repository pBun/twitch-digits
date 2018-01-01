import React, { Component } from 'react';
import { object } from 'prop-types';
import classNames from 'classnames';
import util from '../../../helpers/util';
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
        if (this.props.snapshot) this.state.chart.build(this.props.snapshot);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    };

    componentWillUpdate(nextProps) {
        if (!this.state.chart || nextProps.snapshot == this.props.snapshot) return;
        this.setState({ chartLevel: 'root' });
        this.state.chart.init();
        this.state.chart.build(nextProps.snapshot);
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
        this.state.chart.build(this.props.snapshot);
    };

    getSelectedData() {
        return this.state.chartSelectedNode || this.state.chartBaseNode || {};
    };

    getSelectedBaseData() {
        var selectedType = this.state.chartSelectedNode && this.state.chartSelectedNode.type;
        return selectedType === 'game' ? this.props.snapshot :
          selectedType === 'channel' ? this.state.chartBaseNode :
          this.props.snapshot || { name: '', viewers: 0 };
    };

    getRootData() {
        var rootType = this.state.chartLevel;
        var rootData = rootType === 'root' ? this.props.snapshot :
          rootType === 'channel' ? this.state.chartRootNode :
          this.props.snapshot;
        return rootData || { name: '', viewers: 0 };
    };

    render() {
        const rootData = this.getRootData();
        const selectedData = this.getSelectedData();
        const selectedBaseData = this.getSelectedBaseData();
        var innerInfo;
        if (selectedData && selectedData.type) {
          innerInfo = (<p className="inner-info">
                <span className="title">{ selectedData.name }</span>
                <span className="stat">{ util.prettyNumber(selectedData.viewers) }</span>
                <span className="stat">{ util.prettyPercent(selectedData.viewers / selectedBaseData.viewers, 2) }</span>
            </p>);
        } else {
          innerInfo = (<p className="inner-info">
                    <span className="stat">
                    <span className="icon"><svg viewBox="0 0 16 16" height="100%" version="1.1" width="100%" x="0px" y="0px"><path clip-rule="evenodd" d="M11,14H5H2v-1l3-3h2L5,8V2h6v6l-2,2h2l3,3v1H11z" fill-rule="evenodd"></path></svg></span>
                    <span className="value">{ util.prettyNumber(rootData.viewers) }</span>
                </span>
            </p>);
        }
        return ( 
          <div className={classNames('chart-wrapper', 'level-' + this.state.chartLevel, { 'clickable': this.state.chart && this.state.chart.state.clickable })} ref={(el) => { this.$el = el; }}>
              <div className="explanation" style={ { backgroundImage: this.bgImg(selectedData.image) } }>
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
