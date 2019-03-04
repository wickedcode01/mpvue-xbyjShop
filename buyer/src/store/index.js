import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/utils/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 首页数据
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: []
  },
  mutations: {
    getIndexData (state, res) {
      state.newGoods = res.data.newGoodsList;
      state.hotGoods = res.data.hotGoodsList;
      state.topics = res.data.topicList;
      state.brands = res.data.brandList;
      state.floorGoods = res.data.categoryList;
      state.banner = res.data.banner;
      state.channel = res.data.channel;
    }
  },
  actions: {
    async getIndexData ({ commit }) {
      const res = await api.getIndexData()

      if (res === undefined || res.errno !== 0) {
        // console.log(res);
        return 0
      }
      // console.log(res)
      commit('getIndexData', res)
      return 1
    }
  }
})

export default store
