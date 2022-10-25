import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouterGuard } from './guard'
import generatedRoutes from '~pages'

const routes = setupLayouts(generatedRoutes)
const router = createRouter({
  history: createWebHistory(),
  routes,
})
export async function setupRouter(app: App) {
  app.use(router)
  createRouterGuard(router)
  await router.isReady()
}
