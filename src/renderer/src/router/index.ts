import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

//路由配置
const routes: Array<RouteRecordRaw> = []
//所有页面组件
const views = import.meta.glob('../views/**/*.vue', { eager: true, import: 'default' })

//页面组件路由定义
Object.entries(views).forEach(([file, component]) => {
  //视图路由
  const route = viewRoute(file, component.default)

  //视图路由添加到路由配置
  const group = viewGroup(file)
  group ? group.children.push(route) : routes.push(route)
})

//视图组件链接地址
function viewRoute(file: string, component: any): any {
  const route = { path: '', component, route: component.route || {} }

  //页面自定义的路由
  if (route.route.path) {
    route.path = route.route.path
    return route
  }

  //跟据页面地址自动声明路由
  if (viewGroup(file)) {
    route.path = file.split('/').splice(3).join('/').slice(0, -4)
  } else {
    route.path = '/' + file.split('/').splice(2).join('/').slice(0, -4)
  }

  return route
}

//视图所在布局组件
function viewGroup(file: string): any {
  return routes.find((group: any) => group.children && file.includes(`views${group.path}/`))
}

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
