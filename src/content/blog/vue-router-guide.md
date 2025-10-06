---
title: "Vue Router 实战指南"
description: "深入理解 Vue Router 的核心概念和实战技巧"
createdAt: "2024-01-15"
updatedAt: "2024-01-20"
tags: ["vue", "vue-router", "路由", "导航守卫"]
category: "前端"
featured: false
---

# Vue Router 实战指南

Vue Router 是 Vue.js 官方的路由管理器，用于构建单页面应用。

## 基础概念

### 路由配置

```javascript
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]
```

### 动态路由

```javascript
const routes = [
  {
    path: '/user/:id',
    name: 'User',
    component: User
  }
]
```

## 导航守卫

### 全局前置守卫

```javascript
router.beforeEach((to, from, next) => {
  // 检查用户是否登录
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login')
  } else {
    next()
  }
})
```

### 路由独享守卫

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      // 检查管理员权限
      if (hasAdminRole()) {
        next()
      } else {
        next('/')
      }
    }
  }
]
```

### 组件内守卫

```javascript
export default {
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被验证前调用
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
  },
  beforeRouteLeave(to, from, next) {
    // 在导航离开渲染该组件的对应路由时调用
  }
}
```

## 嵌套路由

### 配置嵌套路由

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        path: 'profile',
        component: UserProfile
      },
      {
        path: 'posts',
        component: UserPosts
      }
    ]
  }
]
```

### 渲染嵌套视图

```vue
<template>
  <div class="user">
    <h2>User {{ $route.params.id }}</h2>
    <router-view></router-view>
  </div>
</template>
```

## 编程式导航

### router.push

```javascript
// 字符串路径
router.push('/home')

// 对象
router.push({ path: '/home' })

// 命名的路由
router.push({ name: 'user', params: { userId: '123' } })

// 带查询参数
router.push({ path: '/register', query: { plan: 'private' } })
```

### router.replace

```javascript
// 不会向 history 添加新记录
router.replace('/home')
```

### router.go

```javascript
// 前进一步
router.go(1)

// 后退一步
router.go(-1)
```

## 路由懒加载

### 组件懒加载

```javascript
const routes = [
  {
    path: '/about',
    component: () => import('./views/About.vue')
  }
]
```

### 把组件按组分块

```javascript
const routes = [
  {
    path: '/foo',
    component: () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
  },
  {
    path: '/bar',
    component: () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
  }
]
```

## 路由元信息

### 定义元信息

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: {
      requiresAuth: true,
      roles: ['admin']
    }
  }
]
```

### 使用元信息

```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 检查认证状态
  }
  next()
})
```

## 滚动行为

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})
```

## 最佳实践

### 1. 使用命名路由

```javascript
// 推荐
router.push({ name: 'user', params: { id: '123' } })

// 不推荐
router.push('/user/123')
```

### 2. 路由守卫中的权限控制

```javascript
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth && !store.getters.isLoggedIn) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})
```

### 3. 动态路由参数变化时刷新数据

```javascript
export default {
  watch: {
    '$route.params': {
      handler(newParams) {
        // 重新获取数据
        this.fetchData(newParams.id)
      },
      immediate: true
    }
  }
}
```

## 总结

Vue Router 提供了强大的路由管理功能：
- 灵活的路由配置
- 完善的导航守卫机制
- 支持嵌套路由和懒加载
- 丰富的编程式导航 API

掌握这些特性可以帮助你构建更好的单页应用。

