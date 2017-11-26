<template>
<div class="day-menu">
    <a class="day-link" v-for="d in sortedDays" :class="{ 'selected': d.getDate() === selected.getDate() }"
        v-tooltip="prettyDate(d)" @click="handleLink(d)">{{ prettyDay(d) }}</a>
</div>
</template>

<script>
import util from '../../helpers/util';
import { VTooltip } from 'v-tooltip';
export default {
    props: [ 'days', 'selected' ],
    computed: {
        sortedDays(scope) {
            return scope.days.sort((a, b) => { new Date(a) - new Date(b); });
        },
    },
    methods: {
        prettyDate(v) {
            var d = new Date(v);
            return d.toLocaleDateString();
        },
        prettyDay(v) {
            var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var day = v.getDay();
            var isToday = util.stripTime(new Date()).getDate() === v.getDate();
            return !isToday ? weekDays[v.getDay()] : 'Today';
        },
        handleLink(day) {
            this.$emit('linkClick', day);
        }
    },
    directives: { tooltip: VTooltip }
}
</script>

<style>
.twitch-digits .day-menu {
    display: flex;
    justify-content: center;
    align-items: flex-start;
}
.twitch-digits .day-link {
    display: block;
    text-align: center;
    margin: 0.6em 0.5em;
    padding: 0.05em 0;
    line-height: 1em;
    cursor: pointer;
    text-transform: uppercase;
    color: rgba(100, 65, 165, 1);
}
.twitch-digits .day-link.selected {
    font-weight: 700;
}
</style>
