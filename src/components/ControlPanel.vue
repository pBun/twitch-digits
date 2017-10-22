<template>
<div class="control-panel" :class="[ position, state ]">
  <a class="control-toggle" @click="toggle"><span class="toggle-text">{{ toggleText }}</span></a>
  <div class="control-content">
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
    props: {
      open: {
        type: Boolean
      },
      toggleText: {
        type: String,
        default: 'controls'
      },
      position: {
        type: String,
        default: 'bottom'
      }
    },
    data() {
      return {
        controlsOpen: false
      };
    },
    computed: {
      state(scope) {
        return scope.controlsOpen ? 'open' : 'closed';
      }
    },
    methods: {
      toggle() {
        this.controlsOpen = !this.controlsOpen;
        this.$emit('open', this.controlsOpen);
      }
    },
    watch: {
      open(newVal, oldVal) {
        if (newVal === oldVal) return;
        this.controlsOpen = newVal;
      }
    }
}
</script>

<style>
  .control-panel .control-content {
    background-color: #dfd7ef;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .control-panel .control-toggle {
    color: #fff;
    background: #6441a5;
    cursor: pointer;
    padding: 0.25em;
    text-align: center;
    text-transform: uppercase;
    z-index: 999;
    letter-spacing: 0.1em;
  }
  .control-panel.left .control-toggle .toggle-text {
    display: block;
  }

  /* bottom */
  .control-panel.bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 200px;
    width: 100vw;
    border-top: 1px solid #d1d1d1;
    transition: transform 0.3s;
  }
  .control-panel.bottom.closed {
      transform: translateY(100%);
  }
  .control-panel.bottom .control-toggle {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    height: 1.5em;
  }

  /* left */
  .control-panel.left {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 300px;
    border-right: 1px solid #d1d1d1;
    transition: transform 0.3s;
  }
  .control-panel.left.closed {
      transform: translateX(-100%);
  }
  .control-panel.left .control-toggle {
    position: absolute;
    top: 0;
    left: 100%;
    height: 100%;
    width: 1.5em;
  }
  .control-panel.left .control-toggle .toggle-text {
    transform: rotate(-90deg) translate(-50%, -50%);
    transform-origin: left top;
    position: absolute;
    top: 50%;
    left: 50%;
  }
</style>
