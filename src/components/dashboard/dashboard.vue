<template lang="pug">
  div#dashboard
    h1 That's the dashboard!
    p You should only get here if you're authenticated!
    p(v-if="email") Your email: {{ email }}
</template>

<script>
  import axios from 'axios';
  export default {
    computed: {
      email () {
        return !this.$store.getters.user ? false : this.$store.getters.user.email
      }
    },
    created () {
      this.$store.dispatch('getUser')
    }
  }
</script>

<style scoped>
  h1, p {
    text-align: center;
  }

  p {
    color: red;
  }
</style>