<template>
<div class="error-modal" :class="{ 'visible': error }">
    <p class="error api-error">{{ error }}</p>
</div>
</template>

<script>
export default {
    props: [ 'error' ]
}
</script>

<style>
.error-modal .error {
  font-size: 20px;
  line-height: 1.2em;
  color: #aa1122;
  padding: 1em;
  background: rgba(255, 255, 255, 0.5);
}
.error-modal .error:before {
    content: 'UH OH, THERE WAS AN ERROR =(';
    font-weight: 600;
    display: block;
    margin-bottom: 0.25em;
}
.error-modal .error:after {
    content: 'TRY REFRESHING';
    font-size: 0.5em;
    margin-top: 1em;
    display: block;
}
</style>
