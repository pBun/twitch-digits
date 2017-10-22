<template>
<div class="chart-wrapper" :class="[ 'level-' + chartLevel, { 'clickable': chart && chart.state.clickable }]">
    <div class="explanation" :style="{ backgroundImage: bgImg(selectedData.image) }">
        <div class="info">
            <p class="inner-info" v-if="selectedData.type">
                <span class="title">{{ selectedData.name }}</span>
                <span class="stat">{{ selectedData.viewers | prettyNumber }}</span>
                <span class="stat">{{ selectedData.viewers / selectedBaseData.viewers | percent(2) }}</span>
            </p>
            <p class="inner-info" v-if="!selectedData.type">
              <span class="stat">
                <span class="icon"><svg viewBox="0 0 16 16" height="100%" version="1.1" width="100%" x="0px" y="0px"><path clip-rule="evenodd" d="M11,14H5H2v-1l3-3h2L5,8V2h6v6l-2,2h2l3,3v1H11z" fill-rule="evenodd"></path></svg></span>
                <span class="value">{{ rootData.viewers | prettyNumber }}</span>
              </span>
            </p>
        </div>
        <span class="back-info">click to go back</span>
    </div>
</div>
</template>

<script>
import util from '../../helpers/util';
import TwitchChart from './TwitchChart';
export default {
    props: [ 'snapshot' ],
    data() {
        return {
            chart: null,
            chartRootNode: null,
            chartBaseNode: null,
            chartSelectedNode: null,
            chartLevel: 'root'
        };
    },
    computed: {
        selectedData(scope) {
            return scope.chartSelectedNode || scope.chartBaseNode || {};
        },
        selectedBaseData(scope) {
            var selectedType = scope.chartSelectedNode && scope.chartSelectedNode.type;
            return selectedType === 'game' ? scope.snapshot :
              selectedType === 'channel' ? scope.chartBaseNode :
              scope.snapshot || { name: '', viewers: 0 };
        },
        rootData(scope) {
            var rootType = scope.chartLevel;
            var rootData = rootType === 'root' ? scope.snapshot :
              rootType === 'channel' ? scope.chartRootNode :
              scope.snapshot;
            return rootData || { name: '', viewers: 0 };
        }
    },
    methods: {
        bgImg(v) {
            if (!v) return '';
            return 'url(' + v + ')';
        },
        rootChangeCallback(d) {
            this.chartLevel = d.data.type;
            this.chartRootNode = d.data;
        },
        selectedCallback(s, b) {
            this.chartSelectedNode = (s || {}).data;
            this.chartBaseNode = (b || {}).data;
        },
        handleResize() {
            if (!this.chart) return;
            this.chart.init();
            this.chart.build(this.snapshot, this.clickable);
        }
    },
    filters: {
        percent(v, decimals) {
            if (typeof v !== 'number') return v;
            return (v * 100).toFixed(decimals || 0) + '%';
        },
        prettyNumber(v) {
          return v.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    watch: {
        snapshot() {
            if (!this.chart) return;
            this.chartLevel = 'root';
            this.chart.init();
            this.chart.build(this.snapshot, this.clickable);
        }
    },
    mounted() {
        window.addEventListener('resize', this.handleResize);
        this.chart = new TwitchChart(this.$el, this.selectedCallback, this.rootChangeCallback);
        if (this.snapshot) this.chart.build(this.snapshot, this.clickable);
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    }
}
</script>

<style>
.chart-wrapper {
    position: relative;
    display: inline-block;
    min-height: 320px;
    min-width: 320px;
}
.chart-wrapper .explanation {
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 70%;
  height: 70%;
  border-radius: 50%;
  text-align: center;
  color: #666;
  pointer-events: none;
  background: no-repeat;
  background-size: cover;
}
.chart-wrapper.clickable .explanation {
  width: 56.5%;
  height: 56.5%;
}
.chart-wrapper .explanation .info {
  position: absolute;
  background: rgba(100,65,165,0.85);
  color: #fefefe;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  margin: auto;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  box-sizing: border-box;
  text-align: center;
  padding: 20% 10%;
}
.chart-wrapper .explanation .info .inner-info {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
}
.chart-wrapper .explanation .title {
  font-size: 1.5em;
  display: block;
  margin-bottom: 0.2em;
  line-height: 1em;
  letter-spacing: 0.05em;
}
.chart-wrapper .explanation .stat {
  font-size: 2em;
  display: block;
  margin-bottom: 0.1em;
  line-height: 1em;
  display: inline-block;
  vertical-align: middle;
  font-weight: 400;
}
.chart-wrapper .explanation .stat:after {
  content: '|';
  font-weight: 100;
  margin: 0 0.15em 0 0.25em;
}
.chart-wrapper .explanation .stat:last-child:after {
  display: none;
}
.chart-wrapper .explanation .icon,
.chart-wrapper .explanation .label,
.chart-wrapper .explanation .value {
  display: inline-block;
  vertical-align: middle;
}
.chart-wrapper .explanation .label {
  font-size: 0.6667em;
  line-height: 1em;
}
.chart-wrapper .explanation .icon {
  height: 1em;
  width: 1em;
  fill: #fff;
}
.chart-wrapper .explanation .back-info {
  color: #fff;
  position: absolute;
  bottom: 20%;
  left: 0;
  right: 0;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}
.chart-wrapper.level-game .explanation .back-info {
  opacity: 0.5;
}
@media (max-width: 480px) {
  .chart-wrapper .explanation .title {
    font-size: 1em;
  }
  .chart-wrapper .explanation .stat {
    font-size: 1em;
  }
  .chart-wrapper .explanation .back-info {
    font-size: 0.75em;
  }
}
</style>
