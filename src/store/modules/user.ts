import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'userInfo',
  state: () => {
    return {
      name: '',
      age: '',
    }
  },
  getters: {},
  actions: {},
})
