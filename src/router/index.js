import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Wechat from 'components/wechat/wechat'
import Discover from 'components/discover/discover'
import Contact from 'components/contact/contact'
import Me from 'components/me/me'
import Account from 'components/account/account'

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/wechat',
      component: Wechat,
      alias: '/'
    },
    {
      path: '/discover',
      component: Discover
    },
    {
      path: '/contact',
      component: Contact
    },
    {
      path: '/me',
      component: Me
    },
    {
      path: '/account',
      component: Account
    }
  ]
})
