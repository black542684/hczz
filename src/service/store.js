import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    judgementId: '',
    judgementName: '',
    page: ''
  },
  mutations: {
    setJudgementId (state, id) {
      state.judgementId = id
      sessionStorage.setItem('judgementId', id)
    },
    setJudgementName (state, name) {
      state.judgementName = name
      sessionStorage.setItem('judgementName', name)
    },
    setPage (state, page) {
      state.page = page
      sessionStorage.setItem('page', page)
    }
  },
  getters: {
    judgementId: state => {
      if (state.judgementId) {
        return state.judgementId
      } else {
        state.judgementId = sessionStorage.getItem('judgementId')
        return state.judgementId
      }
    },
    judgementName: state => {
      if (state.judgementName) {
        return state.judgementName
      } else {
        state.judgementName = sessionStorage.getItem('judgementName')
        return state.judgementName
      }
    },
    page: state => {
      if (state.page) {
        return state.page
      } else {
        state.page = sessionStorage.getItem('page')
        return state.page
      }
    }
  }
})

export default store
