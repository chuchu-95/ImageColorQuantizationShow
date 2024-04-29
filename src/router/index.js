import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '../views/UserLogin.vue'
import HomePage from '../views/HomePage.vue'
import UploadImage from '../views/UploadImage.vue'
import QuantiProcess from '../views/QuantiProcess.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: UserLogin
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/uploadImg',
    name: 'Upload',
    component: UploadImage,
    meta: { requiresAuth: true }
  },
  {
    path: '/quantiPro',
    name: 'Quanti',
    component: QuantiProcess,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !sessionStorage.getItem('loggedIn')) {
    next('/login');
  } else {
    next();
  }
})

export default router
