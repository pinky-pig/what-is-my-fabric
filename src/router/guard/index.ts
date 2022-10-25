import { useTitle } from '@vueuse/core'
import type { Router } from 'vue-router'

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export function createRouterGuard(router: Router) {
  router.beforeEach(async () => {
  })
  router.afterEach((to: any) => {
    useTitle(to.meta.title)
  })
}
