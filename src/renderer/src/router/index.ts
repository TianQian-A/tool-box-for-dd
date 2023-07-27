import { createRouter, createWebHashHistory } from 'vue-router'
import LayoutMain from '@renderer/components/LayoutMain.vue'
import PageHome from '@renderer/components/PageHome.vue'
import PageTwo from '@renderer/components/PageTwo.vue'

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
        },
        {
          path: '/2',
          name: '2',
          component: PageTwo
        }
      ]
    }
  ]
})
