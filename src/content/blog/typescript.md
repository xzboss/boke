---
title: "TypeScript 类型系统深度解析"
description: "掌握 TypeScript 的核心类型系统和高级特性"
createdAt: "2024-01-05"
updatedAt: "2024-01-10"
tags: ["ts", "typescript", "type", "generic", "interface"]
category: "前端"
featured: true
---

# TypeScript 类型系统深度解析

TypeScript 是 JavaScript 的超集，为 JavaScript 添加了静态类型检查，大大提升了代码的可维护性和健壮性。

## 基础类型

### 原始类型

```typescript
// 字符串
let name: string = "张三";

// 数字
let age: number = 25;

// 布尔值
let isActive: boolean = true;

// null 和 undefined
let n: null = null;
let u: undefined = undefined;

// symbol
let sym: symbol = Symbol('key');

// bigint
let big: bigint = 100n;
```

### 数组和元组

```typescript
// 数组
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ['a', 'b', 'c'];

// 元组：固定长度和类型的数组
let tuple: [string, number] = ['age', 25];

// 可选元素
let optionalTuple: [string, number?] = ['name'];

// 剩余元素
let restTuple: [string, ...number[]] = ['numbers', 1, 2, 3];
```

### 对象类型

```typescript
// 对象字面量类型
let user: { name: string; age: number } = {
  name: '张三',
  age: 25
};

// 可选属性
let partialUser: { name: string; age?: number } = {
  name: '李四'
};

// 只读属性
let readonlyUser: { readonly name: string } = {
  name: '王五'
};
// readonlyUser.name = '赵六'; // 错误！
```

## 接口（Interface）

接口是 TypeScript 中定义对象结构的主要方式。

### 基础接口

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // 可选属性
  readonly createdAt: Date; // 只读属性
}

const user: User = {
  id: 1,
  name: '张三',
  createdAt: new Date()
};
```

### 函数接口

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

const search: SearchFunc = (src, sub) => {
  return src.includes(sub);
};
```

### 可索引类型

```typescript
interface StringArray {
  [index: number]: string;
}

const arr: StringArray = ['a', 'b', 'c'];

interface StringMap {
  [key: string]: string;
}

const map: StringMap = {
  name: '张三',
  city: '北京'
};
```

### 接口继承

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const dog: Dog = {
  name: 'Buddy',
  breed: 'Golden Retriever'
};

// 多重继承
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

interface Duck extends Animal, Flyable, Swimmable {
  quack(): void;
}
```

## 类型别名（Type Alias）

type 关键字可以为类型创建别名。

### 基础用法

```typescript
type ID = number | string;
type Point = { x: number; y: number };

let userId: ID = 123;
let position: Point = { x: 10, y: 20 };
```

### 联合类型

```typescript
type Status = 'pending' | 'success' | 'error';

function handleStatus(status: Status) {
  switch (status) {
    case 'pending':
      console.log('处理中');
      break;
    case 'success':
      console.log('成功');
      break;
    case 'error':
      console.log('错误');
      break;
  }
}
```

### 交叉类型

```typescript
type Colorful = { color: string };
type Circle = { radius: number };

type ColorfulCircle = Colorful & Circle;

const cc: ColorfulCircle = {
  color: 'red',
  radius: 10
};
```

## Interface vs Type

### 相同点

都可以描述对象结构：

```typescript
interface IUser {
  name: string;
}

type TUser = {
  name: string;
};
```

### 不同点

**Interface**：
- 可以声明合并
- 可以被类实现（implements）
- 更适合定义对象结构

**Type**：
- 支持联合类型、交叉类型
- 支持类型映射
- 更灵活

```typescript
// 声明合并（只有 interface 支持）
interface Window {
  title: string;
}

interface Window {
  count: number;
}

// Window 现在有 title 和 count 两个属性

// 联合类型（只有 type 支持）
type StringOrNumber = string | number;
```

## 泛型（Generics）

泛型让类型可以参数化，提高代码复用性。

### 基础泛型

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("hello");
let output2 = identity<number>(123);
// 类型推断
let output3 = identity("world"); // T 自动推断为 string
```

### 泛型接口

```typescript
interface GenericIdentityFn<T> {
  (arg: T): T;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

### 泛型类

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
  
  constructor(zero: T, addFn: (x: T, y: T) => T) {
    this.zeroValue = zero;
    this.add = addFn;
  }
}

let numberBox = new GenericNumber<number>(0, (x, y) => x + y);
let stringBox = new GenericNumber<string>("", (x, y) => x + y);
```

### 泛型约束

```typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello"); // OK
logLength([1, 2, 3]); // OK
// logLength(123); // 错误！number 没有 length 属性
```

## 高级类型

### 条件类型

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

### 映射类型

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number; }

type PartialUser = Partial<User>;
// { name?: string; age?: number; }
```

### 工具类型

TypeScript 内置了许多实用的工具类型：

```typescript
// Pick：选择部分属性
type UserName = Pick<User, 'name'>;
// { name: string }

// Omit：排除部分属性
type UserWithoutAge = Omit<User, 'age'>;
// { name: string }

// Record：构造对象类型
type PageInfo = Record<'home' | 'about', { title: string }>;
// { home: { title: string }; about: { title: string } }

// Exclude：排除联合类型中的某些类型
type T0 = Exclude<'a' | 'b' | 'c', 'a'>; // 'b' | 'c'

// Extract：提取联合类型中的某些类型
type T1 = Extract<'a' | 'b' | 'c', 'a' | 'f'>; // 'a'

// NonNullable：排除 null 和 undefined
type T2 = NonNullable<string | number | null | undefined>; // string | number

// ReturnType：获取函数返回值类型
function f1(): string { return 'hello'; }
type T3 = ReturnType<typeof f1>; // string

// Parameters：获取函数参数类型
type T4 = Parameters<typeof f1>; // []
```

## 类型守卫

帮助 TypeScript 缩小类型范围。

### typeof 类型守卫

```typescript
function padLeft(value: string, padding: string | number) {
  if (typeof padding === 'number') {
    return ' '.repeat(padding) + value;
  }
  return padding + value;
}
```

### instanceof 类型守卫

```typescript
class Bird {
  fly() { console.log('飞'); }
}

class Fish {
  swim() { console.log('游'); }
}

function move(animal: Bird | Fish) {
  if (animal instanceof Bird) {
    animal.fly();
  } else {
    animal.swim();
  }
}
```

### 自定义类型守卫

```typescript
interface Cat {
  meow(): void;
}

interface Dog {
  bark(): void;
}

function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined;
}

function makeSound(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow();
  } else {
    animal.bark();
  }
}
```

## 实战技巧

### 1. 使用 const 断言

```typescript
const config = {
  endpoint: 'https://api.example.com',
  timeout: 5000
} as const;

// config.endpoint 的类型是 'https://api.example.com'
// 而不是 string
```

### 2. 使用类型推断

```typescript
// ❌ 不必要的类型注解
const name: string = 'John';

// ✅ 让 TypeScript 自动推断
const name = 'John';
```

### 3. 善用 unknown 替代 any

```typescript
// ❌ 不安全
function process(value: any) {
  return value.toUpperCase();
}

// ✅ 更安全
function process(value: unknown) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  throw new Error('Invalid value');
}
```

### 4. 使用可辨识联合

```typescript
interface Square {
  kind: 'square';
  size: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Square | Rectangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'square':
      return shape.size ** 2;
    case 'rectangle':
      return shape.width * shape.height;
  }
}
```

## 总结

TypeScript 的类型系统非常强大：
- ✅ 提供静态类型检查
- ✅ 更好的 IDE 支持
- ✅ 提升代码可维护性
- ✅ 减少运行时错误
- ✅ 优秀的类型推断能力

掌握 TypeScript 类型系统是现代前端开发的必备技能。

