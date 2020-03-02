<template>
  <div id="app">
    <weather />
  </div>
</template>

<script>
import Weather from '@/pages/Weather.vue'

export default {
  name: 'App',
  components: {
    Weather,
  },
}
</script>

<style lang="scss">
@import '@/styles/_reset.scss';
@import '@/styles/_font.scss';
@import '@/styles/_elements.scss';
</style>
