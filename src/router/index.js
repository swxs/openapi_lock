import Vue from 'vue'
import Router from 'vue-router'
import index from 'Pages/index'
import NotFound from 'Pages/404' // 临时的404页面

Vue.use(Router)

// export default new Router({})
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: index,
      name: 'index'
    },
    {
      // 其他所有路由都指向404页面
      path: '*',
      component: NotFound,
      name: 'NotFound'
    }
  ]
})

export default router
