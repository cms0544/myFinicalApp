import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/FinicalList.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      }
    ]
  },
  {
    path:'/TotalReport',
    component:() => import('@/views/TotalReport.vue')
  },
  {
    path:'/LoginPage',
    component:() => import('@/views/LoginPage.vue')
  },
  {
    path:'/RegisterPage',
    component:()=>import('@/views/RegisterPage.vue')
  },
  {
    path:'/RegisterPage/:id',
    component:()=>import('@/views/RegisterPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
