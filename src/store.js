import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth'
import axiosMain from 'axios'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null
  },
  mutations: {
    userAuth (state, userData) {
      state.idToken = userData.token
      state.userId = userData.userId
    },
    storeUser (state, user) {
      state.user = user
    },
    logout (state) {
      state.idToken = null
      state.userId = null
    }
  },
  actions: {
    signup ({commit, dispatch}, authData) {
      axios.post('/signupNewUser?key=AIzaSyAPcvdLpZcR4IwKBtRtxqNCLx2OblNyHTA', {
          email: authData.email, password: authData.password, returnSecureToken: true
        }).then(res => {
          console.log(res)
          commit('userAuth', { token: res.data.idToken, userId: res.data.localId })
          const now = new Date()
          const tokenExpires = new Date(now.getTime() + res.data.expiresIn * 1000)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('tokenExpires', tokenExpires)
          dispatch('storeUser', authData)
          dispatch('setLogoutTimer', res.data.expiresIn)
        }).catch(error => console.log(error));
    },
    signin ({commit, dispatch}, authData) {
      axios.post('/verifyPassword?key=AIzaSyAPcvdLpZcR4IwKBtRtxqNCLx2OblNyHTA', {
          email: authData.email, password: authData.password, returnSecureToken: true
        }).then(res => {
          console.log(res)
          const now = new Date()
          const tokenExpires = new Date(now.getTime() + res.data.expiresIn * 1000)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('tokenExpires', tokenExpires)
          commit('userAuth', { token: res.data.idToken, userId: res.data.localId })
          dispatch('setLogoutTimer', res.data.expiresIn)
        }).catch(error => console.log(error));
    },
    storeUser ({commit, state}, userData) {
      if (!state.idToken) { return console.log('not logged in') }
      axiosMain.post('/users.json' + '?auth=' + state.idToken, userData).then(res => console.log(res)).catch(error => console.log(error))
    },
    getUser ({commit, state}) {
      if (!state.idToken) { return console.log('not logged in') }
      axiosMain.get('/users.json' + '?auth=' + state.idToken).then(res => {
        const data = res.data;
        const users = [];
        for (let key in data) {
          data[key].id = key;
          users.push(data[key]);
        }
        commit('storeUser', users[0])
      }).catch(error => console.log(error));
    },
    stillLogedin ({commit}) {
      const token = localStorage.getItem('token')
      if (!token) { return }
      const now = new Date()
      const tokenExpires = localStorage.getItem('tokenExpires')
      if (now >= tokenExpires) { return }
      const userId = localStorage.getItem('userId')
      commit('userAuth', {token, userId})
    },
    logout({commit}) {
      commit('logout')
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('tokenExpires')
      router.replace('/signin')
    },
    setLogoutTimer ({commit}, expiration) {
      setTimeout(() => {
        commit('logout')
      }, expiration * 1000)
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    isAuthenticated (state) {
      return state.idToken !== null
    }
  }
})