import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue'
import home from '@/components/home.vue'
import users from '@/components/users.vue'
import roles from '@/components/roles.vue'
import rights from '@/components/rights.vue'
Vue.use(Router)

const router = new Router({
  routes: [

    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home,
      children: [

        {
          path: '/users',
          component: users
        },
        {
          path: '/roles',
          component: roles
        },
        {
          path: '/rights',
          component: rights
        }
      ]
    }

  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
    return
  }
  let token = localStorage.getItem('token')
  if (token) {
    next()
  } else {
    next('/login')
  }
})
export default router
