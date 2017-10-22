<template>
<div class="day-menu">
    <a class="day-link" v-for="d in days" :class="{ 'selected': d.getDate() === selected.getDate() }"
        v-tooltip="prettyDate(d)" @click="handleLink(d)">{{ prettyDay(d) }}</a>
</div>
</template>

<script>
import { VTooltip } from 'v-tooltip';
export default {
    props: [ 'days', 'selected' ],
    methods: {
        prettyDate(v) {
            var d = new Date(v);
            return d.toLocaleDateString();
        },
        prettyDay(v) {
            var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var day = v.getDay();
            var today = (new Date()).getDay();
            return day !== today ? weekDays[v.getDay()] : 'Today';
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
    margin: 0.1em 0.5em;
    padding: 0.05em 0;
    line-height: 1em;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 0.7em;
    color: rgba(100, 65, 165, 1);
    transition: border-color 0.3s;
    border-bottom: 1px solid transparent;
}
.twitch-digits .day-link.selected {
    border-bottom-color: rgba(100, 65, 165, 0.5);
}
</style>
