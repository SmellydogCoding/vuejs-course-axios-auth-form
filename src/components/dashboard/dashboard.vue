<template lang="pug">
  div#dashboard
    h1 That's the dashboard!
    p You should only get here if you're authenticated!
    p Your email: {{ email }}
</template>

<script>
  import axios from 'axios';
  export default {
    data () {
      return {
        email: ''
      }
    },
    created () {
      axios.get('/users.json').then(res => {
        console.log(res)
        const data = res.data;
        const users = [];
        for (let key in data) {
          data[key].id = key;
          users.push(data[key]);
        }
        console.log(users);
        this.email = users[0].email;
      }).catch(error => console.log(error));
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