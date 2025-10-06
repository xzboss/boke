---
title: "Node.js Stream 流式处理"
description: "深入理解 Node.js Stream 的工作原理和实践应用"
createdAt: "2024-01-22"
updatedAt: "2024-01-26"
tags: ["nodejs", "stream", "buffer", "pipe"]
category: "后端"
featured: true
---

# Node.js Stream 流式处理

Stream 是 Node.js 中处理数据的强大抽象，本文将深入探讨其原理和应用。

## 什么是 Stream

### 概念

Stream 是一种处理数据的方式，数据像水流一样连续传输，而不是一次性加载到内存。

### 优势

#### 1. 内存效率

```javascript
// 不使用 Stream - 一次性读取整个文件
const fs = require('fs')
const data = fs.readFileSync('large-file.txt') // 可能占用大量内存

// 使用 Stream - 分块读取
const stream = fs.createReadStream('large-file.txt')
```

#### 2. 时间效率

```javascript
// 边读边处理，不需要等待全部读完
stream.on('data', (chunk) => {
  process(chunk) // 立即处理
})
```

#### 3. 组合性

```javascript
// 可以链式组合多个 Stream
fs.createReadStream('input.txt')
  .pipe(transform1)
  .pipe(transform2)
  .pipe(fs.createWriteStream('output.txt'))
```

## Stream 类型

### Readable Stream

#### 创建可读流

```javascript
const { Readable } = require('stream')

class MyReadable extends Readable {
  constructor(options) {
    super(options)
    this.data = ['Hello', 'World', 'from', 'Stream']
    this.index = 0
  }

  _read() {
    if (this.index < this.data.length) {
      this.push(this.data[this.index++])
    } else {
      this.push(null) // 结束流
    }
  }
}

const readable = new MyReadable()
```

#### 读取数据

##### 事件模式

```javascript
readable.on('data', (chunk) => {
  console.log('收到数据:', chunk.toString())
})

readable.on('end', () => {
  console.log('数据读取完毕')
})

readable.on('error', (err) => {
  console.error('读取错误:', err)
})
```

##### 暂停模式

```javascript
readable.on('readable', () => {
  let chunk
  while ((chunk = readable.read()) !== null) {
    console.log('收到数据:', chunk.toString())
  }
})
```

### Writable Stream

#### 创建可写流

```javascript
const { Writable } = require('stream')

class MyWritable extends Writable {
  constructor(options) {
    super(options)
    this.data = []
  }

  _write(chunk, encoding, callback) {
    this.data.push(chunk)
    console.log('写入数据:', chunk.toString())
    callback() // 完成写入
  }

  _final(callback) {
    console.log('写入完成，共', this.data.length, '块数据')
    callback()
  }
}

const writable = new MyWritable()
```

#### 写入数据

```javascript
writable.write('Hello ')
writable.write('World')
writable.end() // 结束写入

writable.on('finish', () => {
  console.log('所有数据写入完成')
})

writable.on('error', (err) => {
  console.error('写入错误:', err)
})
```

### Duplex Stream

双工流，既可读又可写。

```javascript
const { Duplex } = require('stream')

class MyDuplex extends Duplex {
  constructor(options) {
    super(options)
    this.data = []
  }

  _read() {
    if (this.data.length > 0) {
      this.push(this.data.shift())
    } else {
      this.push(null)
    }
  }

  _write(chunk, encoding, callback) {
    this.data.push(chunk)
    callback()
  }
}
```

### Transform Stream

转换流，是一种特殊的 Duplex Stream。

```javascript
const { Transform } = require('stream')

class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    const upperCased = chunk.toString().toUpperCase()
    this.push(upperCased)
    callback()
  }
}

// 使用
const upperCase = new UpperCaseTransform()
process.stdin.pipe(upperCase).pipe(process.stdout)
```

## Buffer 和 Stream

### Buffer 基础

```javascript
// 创建 Buffer
const buf1 = Buffer.from('Hello')
const buf2 = Buffer.alloc(10)
const buf3 = Buffer.allocUnsafe(10)

// 读取 Buffer
console.log(buf1.toString()) // 'Hello'
console.log(buf1.toString('hex')) // '48656c6c6f'

// Buffer 操作
const buf4 = Buffer.concat([buf1, buf2])
const buf5 = buf1.slice(0, 2)
```

### highWaterMark

控制内部缓冲区大小。

```javascript
const readable = fs.createReadStream('file.txt', {
  highWaterMark: 16 * 1024 // 16KB
})

const writable = fs.createWriteStream('output.txt', {
  highWaterMark: 8 * 1024 // 8KB
})
```

## 背压 (Backpressure)

### 问题

当写入速度跟不上读取速度时，数据会积压在内存中。

### 解决方案

```javascript
const readable = fs.createReadStream('large-file.txt')
const writable = fs.createWriteStream('output.txt')

readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk)
  
  if (!canContinue) {
    // 写入缓冲区满了，暂停读取
    readable.pause()
  }
})

writable.on('drain', () => {
  // 缓冲区已清空，恢复读取
  readable.resume()
})

readable.on('end', () => {
  writable.end()
})
```

### 使用 pipe 自动处理

```javascript
// pipe 会自动处理背压
readable.pipe(writable)
```

## 实战案例

### 文件复制

```javascript
const fs = require('fs')

function copyFile(source, dest) {
  return new Promise((resolve, reject) => {
    const readable = fs.createReadStream(source)
    const writable = fs.createWriteStream(dest)
    
    readable.pipe(writable)
    
    writable.on('finish', resolve)
    writable.on('error', reject)
    readable.on('error', reject)
  })
}

copyFile('source.txt', 'dest.txt')
  .then(() => console.log('复制完成'))
  .catch(err => console.error('复制失败:', err))
```

### 文件压缩

```javascript
const fs = require('fs')
const zlib = require('zlib')

function compressFile(source, dest) {
  const readable = fs.createReadStream(source)
  const writable = fs.createWriteStream(dest)
  const gzip = zlib.createGzip()
  
  readable
    .pipe(gzip)
    .pipe(writable)
    .on('finish', () => console.log('压缩完成'))
}

compressFile('file.txt', 'file.txt.gz')
```

### CSV 解析

```javascript
const fs = require('fs')
const { Transform } = require('stream')

class CSVParser extends Transform {
  constructor(options) {
    super(options)
    this.header = null
  }

  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n')
    
    for (const line of lines) {
      if (!this.header) {
        this.header = line.split(',')
        continue
      }
      
      const values = line.split(',')
      const obj = {}
      
      this.header.forEach((key, i) => {
        obj[key] = values[i]
      })
      
      this.push(JSON.stringify(obj) + '\n')
    }
    
    callback()
  }
}

fs.createReadStream('data.csv')
  .pipe(new CSVParser())
  .pipe(fs.createWriteStream('data.json'))
```

### 日志处理

```javascript
const fs = require('fs')
const { Transform } = require('stream')

class LogFilter extends Transform {
  _transform(chunk, encoding, callback) {
    const line = chunk.toString()
    
    // 只保留 ERROR 级别的日志
    if (line.includes('[ERROR]')) {
      this.push(line)
    }
    
    callback()
  }
}

fs.createReadStream('app.log')
  .pipe(new LogFilter())
  .pipe(fs.createWriteStream('errors.log'))
```

### HTTP 文件上传

```javascript
const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    const writable = fs.createWriteStream('uploaded.txt')
    
    req.pipe(writable)
    
    writable.on('finish', () => {
      res.end('上传成功')
    })
    
    writable.on('error', (err) => {
      res.statusCode = 500
      res.end('上传失败: ' + err.message)
    })
  }
})

server.listen(3000)
```

### 实时数据处理

```javascript
const { Readable } = require('stream')

class DataGenerator extends Readable {
  constructor(options) {
    super(options)
    this.count = 0
    this.max = 100
  }

  _read() {
    if (this.count < this.max) {
      const data = {
        id: this.count,
        value: Math.random(),
        timestamp: Date.now()
      }
      
      this.push(JSON.stringify(data) + '\n')
      this.count++
    } else {
      this.push(null)
    }
  }
}

const generator = new DataGenerator()

generator
  .pipe(process.stdout) // 输出到控制台
```

## Stream 工具库

### through2

简化 Transform Stream 创建。

```javascript
const through2 = require('through2')

const stream = through2((chunk, enc, callback) => {
  callback(null, chunk.toString().toUpperCase())
})

process.stdin.pipe(stream).pipe(process.stdout)
```

### pump

更好的错误处理。

```javascript
const pump = require('pump')
const fs = require('fs')

pump(
  fs.createReadStream('source.txt'),
  transformStream,
  fs.createWriteStream('dest.txt'),
  (err) => {
    if (err) console.error('管道失败:', err)
    else console.log('管道完成')
  }
)
```

### split2

按行分割流。

```javascript
const split = require('split2')
const fs = require('fs')

fs.createReadStream('file.txt')
  .pipe(split())
  .on('data', (line) => {
    console.log('行:', line)
  })
```

## 性能优化

### 1. 合理设置 highWaterMark

```javascript
// 处理大文件时增加缓冲区
const stream = fs.createReadStream('huge-file.txt', {
  highWaterMark: 64 * 1024 // 64KB
})
```

### 2. 对象模式

```javascript
const stream = new Transform({
  objectMode: true, // 传递对象而不是 Buffer
  transform(obj, encoding, callback) {
    // 直接处理对象
    callback(null, processObject(obj))
  }
})
```

### 3. 避免阻塞

```javascript
class AsyncTransform extends Transform {
  async _transform(chunk, encoding, callback) {
    try {
      const result = await asyncProcess(chunk)
      callback(null, result)
    } catch (err) {
      callback(err)
    }
  }
}
```

## 最佳实践

### 1. 错误处理

```javascript
readable
  .on('error', handleError)
  .pipe(transform)
  .on('error', handleError)
  .pipe(writable)
  .on('error', handleError)
```

### 2. 及时清理

```javascript
function cleanup() {
  readable.destroy()
  writable.destroy()
}

process.on('SIGINT', cleanup)
process.on('uncaughtException', cleanup)
```

### 3. 使用 pipeline

```javascript
const { pipeline } = require('stream')

pipeline(
  fs.createReadStream('source.txt'),
  transform1,
  transform2,
  fs.createWriteStream('dest.txt'),
  (err) => {
    if (err) console.error('Pipeline 失败:', err)
    else console.log('Pipeline 完成')
  }
)
```

## 总结

Node.js Stream 是处理大数据的利器：
- 内存高效，时间高效
- 支持链式操作
- 自动处理背压
- 丰富的生态系统

掌握 Stream 可以让你的 Node.js 应用更加高效和优雅。

