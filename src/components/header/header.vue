<template lang="pug">
  header#header
    div.logo
      router-link(to="/") Vue - Complete Guide
    nav
      ul
        li(v-if="!auth")
          router-link(to="/signup") Sign Up
        li(v-if="!auth")
          router-link(to="/signin") Sign In
        li(v-if="auth")
          router-link(to="/dashboard") Dashboard
        li(v-if="auth" @click="logout")
          button.logout Logout
</template>

<script>
  export default {
    computed: {
      auth() {
        return this.$store.getters.isAuthenticated
      }
    },
    methods: {
      logout() {
        this.$store.dispatch('logout')
      }
    }
  }
</script>

<style scoped>
  #header {
    height: 56px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    background-color: #521751;
    padding: 0 20px;
  }

  .logo {
    font-weight: bold;
    color: white;
  }

  .logo a {
    text-decoration: none;
    color: white;
  }

  nav {
    height: 100%;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  li {
    margin: 0 16px;
  }

  li a {
    text-decoration: none;
    color: white;
  }

  li a:hover,
  li a:active,
  li a.router-link-active {
    color: #fa923f;
  }
  
  .logout {
    background-color: transparent;
    border: none;
    font: inherit;
    color: white;
    cursor: pointer;
  }
</style>