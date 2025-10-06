---
title: "JavaScript 异步编程完全指南"
description: "从回调函数到 Promise 再到 async/await 的演进"
createdAt: "2024-01-08"
updatedAt: "2024-01-12"
tags: ["js", "javascript", "async", "promise", "es6"]
category: "前端"
featured: false
---

# JavaScript 异步编程完全指南

JavaScript 是213单线程语言，但通过异步编程可以实现非阻塞操作，这是 JavaScript 最重要的特性之一。

## 为什么需要异步

### 同步代码的问题

```javascript
// 同步代码会阻塞后续执行
console.log('开始');
// 假设这是一个耗时操作
for (let i = 0; i < 1000000000; i++) {}
console.log('结束'); // 需要等待循环结束才能执行
```

### 异步的优势

- 不阻塞主线程
- 提高程序响应性
- 充分利用 I/O 等待时间

## 回调函数（Callback）

最早的异步解决方案。

```javascript
function getData(callback) {
  setTimeout(() => {
    const data = { id: 1, name: '用户' };
    callback(data);
  }, 1000);
}

getData((data) => {
  console.log('获取到数据：', data);
});
```

### 回调地狱

当多个异步操作需要依次执行时，会出现"回调地狱"：

```javascript
getData((data) => {
  processData(data, (processed) => {
    saveData(processed, (result) => {
      sendNotification(result, (status) => {
        console.log('全部完成');
      });
    });
  });
});
```

**问题**：
- 代码难以阅读和维护
- 错误处理困难
- 无法使用 try/catch

## Promise

ES6 引入的 Promise 解决了回调地狱问题。

### 基础用法

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('操作成功');
    } else {
      reject('操作失败');
    }
  }, 1000);
});

promise
  .then(result => {
    console.log(result);
    return '下一步';
  })
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    console.log('无论成功失败都会执行');
  });
```

### Promise 链式调用

```javascript
getData()
  .then(data => processData(data))
  .then(processed => saveData(processed))
  .then(result => sendNotification(result))
  .then(() => console.log('全部完成'))
  .catch(error => console.error('出错了：', error));
```

### Promise 静态方法

#### Promise.all

所有 Promise 都成功才成功：

```javascript
const promises = [
  fetch('/api/user'),
  fetch('/api/posts'),
  fetch('/api/comments')
];

Promise.all(promises)
  .then(([user, posts, comments]) => {
    console.log('全部数据获取成功');
  })
  .catch(error => {
    console.error('有请求失败：', error);
  });
```

#### Promise.race

返回最先完成的 Promise：

```javascript
const timeout = new Promise((_, reject) => {
  setTimeout(() => reject('超时'), 5000);
});

const request = fetch('/api/data');

Promise.race([request, timeout])
  .then(data => console.log('成功'))
  .catch(error => console.error(error));
```

#### Promise.allSettled

等待所有 Promise 完成（无论成功失败）：

```javascript
const promises = [
  Promise.resolve('成功1'),
  Promise.reject('失败'),
  Promise.resolve('成功2')
];

Promise.allSettled(promises)
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log('成功：', result.value);
      } else {
        console.log('失败：', result.reason);
      }
    });
  });
```

#### Promise.any

返回第一个成功的 Promise：

```javascript
const promises = [
  fetch('https://api1.com/data'),
  fetch('https://api2.com/data'),
  fetch('https://api3.com/data')
];

Promise.any(promises)
  .then(data => console.log('第一个成功的数据：', data))
  .catch(() => console.log('全部失败'));
```

## async/await

ES2017 引入的语法糖，让异步代码看起来像同步代码。

### 基础用法

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('请求失败：', error);
  }
}

// 使用
fetchData().then(data => console.log(data));
```

### 并行执行

```javascript
// ❌ 串行执行（慢）
async function serial() {
  const user = await fetchUser();      // 等待 1 秒
  const posts = await fetchPosts();    // 再等待 1 秒
  // 总共 2 秒
}

// ✅ 并行执行（快）
async function parallel() {
  const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts()
  ]);
  // 总共 1 秒（同时执行）
}
```

### 错误处理

```javascript
async function getData() {
  try {
    const data = await fetch('/api/data');
    return data;
  } catch (error) {
    // 捕获 fetch 或 JSON 解析错误
    console.error(error);
    throw error; // 重新抛出或返回默认值
  }
}
```

### 循环中使用 await

```javascript
// ❌ 不推荐：串行执行
async function processItems(items) {
  for (const item of items) {
    await processItem(item); // 一个接一个
  }
}

// ✅ 推荐：并行执行
async function processItems(items) {
  await Promise.all(
    items.map(item => processItem(item))
  );
}
```

## 事件循环（Event Loop）

理解异步的关键是理解事件循环机制。

### 执行栈和任务队列

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// 输出顺序：1 4 3 2
```

**执行顺序**：
1. 同步代码：1, 4
2. 微任务（Microtask）：Promise.then -> 3
3. 宏任务（Macrotask）：setTimeout -> 2

### 微任务 vs 宏任务

**微任务**：
- Promise.then/catch/finally
- MutationObserver
- queueMicrotask

**宏任务**：
- setTimeout/setInterval
- setImmediate (Node.js)
- I/O 操作
- UI 渲染

## 实战案例

### 1. 请求重试

```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`重试 ${i + 1}/${retries}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
```

### 2. 请求超时控制

```javascript
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('请求超时')), timeout)
    )
  ]);
}
```

### 3. 并发控制

限制同时进行的请求数量：

```javascript
async function concurrentRequest(urls, limit = 3) {
  const results = [];
  const executing = [];

  for (const url of urls) {
    const promise = fetch(url).then(res => res.json());
    results.push(promise);

    if (urls.length >= limit) {
      const e = promise.then(() => 
        executing.splice(executing.indexOf(e), 1)
      );
      executing.push(e);
      
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(results);
}
```

## 最佳实践

### 1. 优先使用 async/await

```javascript
// ✅ 清晰易读
async function good() {
  const data = await getData();
  return processData(data);
}

// ❌ 不必要的复杂
function bad() {
  return getData().then(data => processData(data));
}
```

### 2. 正确处理错误

```javascript
async function handleErrors() {
  try {
    const data = await riskyOperation();
    return data;
  } catch (error) {
    console.error('操作失败：', error);
    // 返回默认值或重新抛出
    return defaultValue;
  }
}
```

### 3. 避免不必要的 await

```javascript
// ❌ 不必要的 await
async function bad() {
  return await getData(); // 多余
}

// ✅ 直接返回 Promise
async function good() {
  return getData();
}
```

## 总结

JavaScript 异步编程经历了三个阶段的演进：
1. **回调函数**：最基础，但容易陷入回调地狱
2. **Promise**：解决了回调地狱，支持链式调用
3. **async/await**：让异步代码看起来像同步代码，最优雅

掌握异步编程是成为优秀 JavaScript 开发者的必经之路。

