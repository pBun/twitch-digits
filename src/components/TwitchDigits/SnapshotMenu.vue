<template>
<div class="snapshot-menu">
    <a class="snapshot-link" v-for="(t, i) in times" :key="t._time" :class="{ 'selected': t._time === selected }" :style="{ height: calcHeight(t.viewers) }"
        @click="handleLink($event, t._time)" v-tooltip="prettyTime(t._time)">{{ i }}</a>
</div>
</template>

<script>
import { VTooltip } from 'v-tooltip';
export default {
    props: [ 'times', 'selected' ],
    computed: {
        maxViewers(scope) {
            return scope.times
                .map(a => a.viewers)
                .reduce((a, b) => Math.max(a || 0, b), 0);
        }
    },
    methods: {
        calcHeight(v) {
            return this.percent(v / this.maxViewers, 2);
        },
        percent(v, decimals) {
            if (typeof v !== 'number') return v;
            return (v * 100).toFixed(decimals || 0) + '%';
        },
        prettyTime(v) {
            if (!v) return 'Now';
            var d = new Date(v);
            return d.toLocaleTimeString();
        },
        handleLink(e, time) {
            var event = document.createEvent('HTMLEvents');
            event.initEvent('blur', true, false);
            e.target.dispatchEvent(event);
            this.$emit('linkClick', time);
        }
    },
    directives: { tooltip: VTooltip }
}
</script>

<style>
.twitch-digits .snapshot-menu {
    min-height: 100px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
}
.twitch-digits .snapshot-link {
    display: block;
    width: 100%;
    text-align: center;
    cursor: pointer;
    background-color: rgba(100, 65, 165, 0.5);
    height: 10%;
    text-indent: -100%;
    overflow: hidden;
    transition: background-color 0.3s;
    margin-left: 1px;
    margin-right: 1px;
    max-width: 40px;
}
.twitch-digits .snapshot-link:hover {
    background-color: rgba(100, 65, 165, 0.95);
}
.twitch-digits .snapshot-link.selected {
    background-color: rgba(100, 65, 165, 1);
}
</style>
