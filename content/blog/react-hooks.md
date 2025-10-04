---
title: "React Hooks 完全指南"
description: "深入理解 React Hooks 的使用方法和最佳实践"
createdAt: "2024-01-10"
updatedAt: "2024-01-15"
tags: ["react", "hooks", "useState", "useEffect", "custom-hooks"]
category: "前端"
featured: true
---

# React Hooks 完全指南

React Hooks 是 React 16.8 引入的新特性，它让你在不编写 class 的情况下使用 state 和其他 React 特性。

## 为什么需要 Hooks

在 Hooks 之前，函数组件被称为"无状态组件"，只能用于展示。如果需要状态管理，就必须使用 class 组件。

### class 组件的问题

- **复杂组件难以理解**：生命周期函数中包含大量不相关的逻辑
- **难以复用状态逻辑**：需要使用 render props 或 HOC，导致"嵌套地狱"
- **this 指向问题**：需要频繁 bind this

## 基础 Hooks

### useState

`useState` 是最常用的 Hook，用于在函数组件中添加状态。

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}
```

**重要特性**：
- 可以多次调用 `useState` 声明多个状态
- 状态更新是异步的
- 函数式更新：`setCount(prev => prev + 1)`

### useEffect

`useEffect` 用于处理副作用，如数据获取、订阅、DOM 操作等。

```javascript
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 数据获取
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });

    // 清理函数
    return () => {
      // 取消请求、清理订阅等
    };
  }, [userId]); // 依赖项数组

  if (loading) return <div>加载中...</div>;
  return <div>用户名：{user.name}</div>;
}
```

**执行时机**：
- 组件挂载后执行
- 依赖项变化时重新执行
- 组件卸载前执行清理函数

### useContext

`useContext` 用于在组件树中共享数据，避免 props 层层传递。

```javascript
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ 
      background: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333'
    }}>
      主题按钮
    </button>
  );
}
```

## 额外的 Hooks

### useRef

用于保存可变值，且不会触发重新渲染。

```javascript
function TextInput() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleFocus}>聚焦输入框</button>
    </>
  );
}
```

### useMemo

用于优化性能，缓存计算结果。

```javascript
function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    // 昂贵的计算
    return data.map(item => /* 复杂处理 */);
  }, [data]);

  return <div>{/* 使用 processedData */}</div>;
}
```

### useCallback

用于缓存函数引用，避免子组件不必要的重新渲染。

```javascript
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // 函数引用不会改变

  return <Child onClick={handleClick} />;
}
```

## 自定义 Hooks

自定义 Hooks 是复用状态逻辑的最佳方式。

### 数据获取 Hook

```javascript
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// 使用
function UserList() {
  const { data, loading, error } = useApi('/api/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <ul>{data.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

### 本地存储 Hook

```javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// 使用
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      当前主题：{theme}
    </button>
  );
}
```

## Hooks 使用规则

### 1. 只在顶层调用 Hooks

❌ 错误：
```javascript
function Bad() {
  if (condition) {
    const [count, setCount] = useState(0); // 错误！
  }
}
```

✅ 正确：
```javascript
function Good() {
  const [count, setCount] = useState(0);
  
  if (condition) {
    // 使用 count
  }
}
```

### 2. 只在 React 函数中调用 Hooks

- React 函数组件
- 自定义 Hooks

❌ 不能在普通 JavaScript 函数中调用

## 性能优化技巧

### 1. 避免不必要的状态

```javascript
// ❌ 不好
function Bad() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);
}

// ✅ 好
function Good() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const fullName = `${firstName} ${lastName}`; // 直接计算
}
```

### 2. 使用 useMemo 和 useCallback

只在必要时使用，过度优化反而影响性能。

### 3. 拆分组件

将大组件拆分成小组件，减少重新渲染的范围。

## 总结

React Hooks 带来了：
- ✅ 更简洁的代码
- ✅ 更好的逻辑复用
- ✅ 更容易理解的组件
- ✅ 更好的类型推导（TypeScript）

掌握 Hooks 是现代 React 开发的必备技能。

