import { createRouter, createWebHashHistory } from 'vue-router'
import LayoutMain from '@renderer/components/LayoutMain.vue'
import PageHome from '@renderer/components/PageHome.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: LayoutMain,
      children: [
        {
          path: '',
          component: PageHome
        }
      ]
    }
  ]
})
