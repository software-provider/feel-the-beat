import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Battles from '@/components/Battles'
import Arena from '@/components/Arena'
import Studio from '@/components/Studio'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/arena',
      name: 'arena',
      component: Arena
    },
    { 
      path: '/arena/:battleId', 
      name: 'battle',
      component: Battles 
    },
    {
      path: '/studio',
      name: 'studio',
      component: Studio
    }
  ]
})
