---
title: "React 性能优化实践"
description: "全面了解 React 性能优化的各种技巧和最佳实践"
createdAt: "2024-01-18"
updatedAt: "2024-01-22"
tags: ["react", "性能优化", "memo", "useMemo", "useCallback"]
category: "前端"
featured: true
---

# React 性能优化实践

性能优化是 React 应用开发中的重要课题。本文将介绍各种性能优化技巧。

## 为什么需要性能优化

### 常见性能问题

#### 1. 不必要的重新渲染

组件在状态没有实际变化时也会重新渲染。

#### 2. 大量数据渲染

列表渲染时，数据量过大导致页面卡顿。

#### 3. 复杂计算

每次渲染都执行复杂的计算逻辑。

## React.memo

### 基本使用

```jsx
const MyComponent = React.memo(function MyComponent(props) {
  return <div>{props.value}</div>
})
```

### 自定义比较函数

```jsx
const MyComponent = React.memo(
  function MyComponent(props) {
    return <div>{props.value}</div>
  },
  (prevProps, nextProps) => {
    // 返回 true 表示不需要重新渲染
    return prevProps.value === nextProps.value
  }
)
```

### 何时使用

- 组件经常以相同的 props 渲染
- 组件渲染成本较高
- props 比较简单，比较成本低

## useMemo

### 缓存计算结果

```jsx
function ExpensiveComponent({ items }) {
  const total = useMemo(() => {
    console.log('计算总价...')
    return items.reduce((sum, item) => sum + item.price, 0)
  }, [items])

  return <div>总价: {total}</div>
}
```

### 缓存组件

```jsx
function Parent({ data }) {
  const child = useMemo(() => {
    return <ChildComponent data={data} />
  }, [data])

  return <div>{child}</div>
}
```

### 使用场景

- 复杂计算或数据转换
- 避免子组件不必要的重新渲染
- 创建稳定的对象引用

## useCallback

### 基本使用

```jsx
function Parent() {
  const [count, setCount] = useState(0)
  
  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, [])
  
  return <Child onClick={handleClick} />
}
```

### 与 useMemo 的区别

```jsx
// 使用 useCallback
const handleClick = useCallback(() => {
  doSomething(a, b)
}, [a, b])

// 等价于使用 useMemo
const handleClick = useMemo(() => {
  return () => doSomething(a, b)
}, [a, b])
```

## 虚拟列表

### react-window

```jsx
import { FixedSizeList } from 'react-window'

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  )

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
```

### react-virtualized

提供更多功能：
- 动态高度列表
- 网格布局
- 无限滚动
- 多列列表

## 代码分割

### React.lazy

```jsx
const LazyComponent = React.lazy(() => import('./LazyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
```

### 路由级别分割

```jsx
const Home = lazy(() => import('./routes/Home'))
const About = lazy(() => import('./routes/About'))

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  )
}
```

## 状态管理优化

### Context 分离

```jsx
// 不好的做法：所有状态放在一个 Context
const AppContext = createContext()

// 好的做法：按功能分离 Context
const UserContext = createContext()
const ThemeContext = createContext()
const SettingsContext = createContext()
```

### 选择性订阅

```jsx
function useUserName() {
  const user = useContext(UserContext)
  return user.name
}

// 只有 name 变化时才重新渲染
function UserGreeting() {
  const name = useUserName()
  return <div>Hello, {name}!</div>
}
```

## 防抖和节流

### 防抖 (Debounce)

```jsx
function SearchInput() {
  const [query, setQuery] = useState('')
  
  const debouncedSearch = useMemo(
    () => debounce((value) => {
      // 执行搜索
      performSearch(value)
    }, 300),
    []
  )
  
  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }
  
  return <input value={query} onChange={handleChange} />
}
```

### 节流 (Throttle)

```jsx
function ScrollComponent() {
  const handleScroll = useMemo(
    () => throttle(() => {
      // 处理滚动
      console.log('Scrolling...')
    }, 100),
    []
  )
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])
  
  return <div>Scroll me!</div>
}
```

## 图片优化

### 懒加载

```jsx
function LazyImage({ src, alt }) {
  const imgRef = useRef()
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <img
      ref={imgRef}
      src={isVisible ? src : ''}
      alt={alt}
    />
  )
}
```

### 响应式图片

```jsx
function ResponsiveImage({ src, alt }) {
  return (
    <picture>
      <source
        media="(min-width: 1024px)"
        srcSet={`${src}-large.jpg`}
      />
      <source
        media="(min-width: 768px)"
        srcSet={`${src}-medium.jpg`}
      />
      <img src={`${src}-small.jpg`} alt={alt} />
    </picture>
  )
}
```

## 性能监控

### React DevTools Profiler

```jsx
import { Profiler } from 'react'

function onRenderCallback(
  id, // 组件标识
  phase, // "mount" 或 "update"
  actualDuration, // 渲染耗时
  baseDuration, // 预估渲染耗时
  startTime, // 开始时间
  commitTime, // 提交时间
  interactions // Set of interactions
) {
  console.log({ id, phase, actualDuration })
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Main />
    </Profiler>
  )
}
```

### Web Vitals

```jsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  console.log(metric)
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

## 最佳实践总结

### 1. 避免过度优化

不要在没有性能问题时就使用 memo、useMemo 等。

### 2. 合理使用工具

- 使用 React DevTools Profiler 找出性能瓶颈
- 使用 Chrome DevTools 分析性能

### 3. 优化顺序

1. 代码分割和懒加载
2. 虚拟列表（大数据量）
3. React.memo（避免不必要渲染）
4. useMemo 和 useCallback（复杂计算）

### 4. 状态管理

- 状态尽可能放在靠近使用它的组件
- 避免不必要的全局状态
- Context 按功能分离

## 总结

React 性能优化是一个系统工程：
- 使用正确的优化工具
- 在正确的时机优化
- 持续监控性能指标
- 避免过度优化

记住：**过早优化是万恶之源**，先让代码工作，再让它快速工作。

