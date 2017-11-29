<template lang="pug">
  div#app
    app-header
    router-view
</template>

<script>
  import Header from './components/header/header.vue'
  export default {
    name: 'app',
    components: {
      'app-header': Header
    },
    created () {
      this.$store.dispatch('stillLogedin')
    }
  }
</script>

<style>
  body, html {
    margin: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
</style>