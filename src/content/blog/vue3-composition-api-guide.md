---
title: "Vue 3 Composition API 完全指南"
description: "深入理解 Vue 3 Composition API 的核心概念和最佳实践"
createdAt: "2024-01-15T10:00:00Z"
updatedAt: "2024-01-20T15:30:00Z"
tags: ["vue", "vue3", "composition-api", "javascript", "frontend"]
category: "frontend"
featured: true
---

# Vue 3 Composition API 完全指南

Vue 3 的 Composition API 是一个革命性的特性，它让我们能够更好地组织和复用组件逻辑。本文将深入探讨 Composition API 的核心概念、使用方法和最佳实践。

## 什么是 Composition API？

Composition API 是 Vue 3 引入的一种新的组件逻辑组织方式，它基于函数式编程的思想，让我们能够将相关的逻辑代码组织在一起，而不是分散在不同的选项中。

## 核心概念

### 1. setup() 函数

`setup()` 是 Composition API 的入口点，它在组件创建之前执行。

```javascript
import { ref, reactive, computed } from 'vue'

export default {
  setup() {
    // 响应式数据
    const count = ref(0)
    const state = reactive({
      name: 'Vue 3',
      version: '3.0'
    })
    
    // 计算属性
    const doubleCount = computed(() => count.value * 2)
    
    // 方法
    const increment = () => {
      count.value++
    }
    
    return {
      count,
      state,
      doubleCount,
      increment
    }
  }
}
```

### 2. 响应式引用 (ref)

`ref` 用于创建响应式的原始值引用。

```javascript
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0
count.value = 1
console.log(count.value) // 1
```

### 3. 响应式对象 (reactive)

`reactive` 用于创建响应式的对象。

```javascript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  name: 'Vue 3'
})

state.count++ // 自动触发更新
```

## 生命周期钩子

Composition API 提供了对应的生命周期钩子：

```javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    onUpdated(() => {
      console.log('组件已更新')
    })
    
    onUnmounted(() => {
      console.log('组件已卸载')
    })
  }
}
```

## 组合式函数 (Composables)

Composition API 的强大之处在于可以创建可复用的组合式函数：

```javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  const doubleCount = computed(() => count.value * 2)
  
  return {
    count,
    increment,
    decrement,
    reset,
    doubleCount
  }
}
```

## 最佳实践

1. **使用组合式函数提取逻辑**：将相关的逻辑提取到独立的函数中
2. **合理使用 ref 和 reactive**：原始值用 ref，对象用 reactive
3. **避免在 setup 中使用 this**：Composition API 中 this 是 undefined
4. **使用 TypeScript**：获得更好的类型支持和开发体验

## 总结

Composition API 为 Vue 3 带来了更灵活、更强大的组件逻辑组织方式。通过合理使用 Composition API，我们可以创建更易维护、更易测试的 Vue 应用。

---

*本文介绍了 Vue 3 Composition API 的核心概念和使用方法，希望对你的 Vue 3 学习之旅有所帮助。*
