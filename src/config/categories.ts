export interface Category {
  id: string
  name: string
  path: string
  level: number
  parentId: string | null
  tags: string[]
  children: Category[]
}

export const categories: Category[] = [
  {
    id: "frontend",
    name: "前端",
    path: "/blog/frontend",
    level: 1,
    parentId: null,
    tags: [],
    children: [
      {
        id: "vue",
        name: "Vue",
        path: "/blog/frontend/vue",
        level: 2,
        parentId: "frontend",
        tags: ["vue", "vue3", "composition-api", "pinia", "vue-router", "nuxt", "vite-vue"],
        children: []
      },
      {
        id: "react",
        name: "React",
        path: "/blog/frontend/react",
        level: 2,
        parentId: "frontend",
        tags: ["react", "jsx", "hooks", "redux", "nextjs", "gatsby", "vite-react"],
        children: []
      },
      {
        id: "vite",
        name: "Vite",
        path: "/blog/frontend/vite",
        level: 2,
        parentId: "frontend",
        tags: ["vite", "vite-vue", "vite-react", "rollup", "esbuild", "hmr"],
        children: []
      },
      {
        id: "javascript",
        name: "JavaScript",
        path: "/blog/frontend/javascript",
        level: 2,
        parentId: "frontend",
        tags: ["js", "javascript", "es6", "es2020", "es2021", "es2022", "es2023", "async", "promise", "generator", "proxy", "symbol"],
        children: []
      },
      {
        id: "typescript",
        name: "TypeScript",
        path: "/blog/frontend/typescript",
        level: 2,
        parentId: "frontend",
        tags: ["ts", "typescript", "interface", "type", "generic", "decorator", "tsx"],
        children: []
      },
      {
        id: "html",
        name: "HTML",
        path: "/blog/frontend/html",
        level: 2,
        parentId: "frontend",
        tags: ["html", "html5", "semantic", "accessibility", "seo", "meta"],
        children: []
      },
      {
        id: "css",
        name: "CSS",
        path: "/blog/frontend/css",
        level: 2,
        parentId: "frontend",
        tags: ["css", "css3", "flexbox", "grid", "animation", "transition", "sass", "scss", "less", "tailwind", "styled-components"],
        children: []
      }
    ]
  },
  {
    id: "backend",
    name: "后端",
    path: "/blog/backend",
    level: 1,
    parentId: null,
    tags: [],
    children: [
      {
        id: "nodejs",
        name: "Node.js",
        path: "/blog/backend/nodejs",
        level: 2,
        parentId: "backend",
        tags: ["nodejs", "node", "npm", "yarn", "pnpm", "express", "koa", "fastify", "nest"],
        children: []
      },
      {
        id: "python",
        name: "Python",
        path: "/blog/backend/python",
        level: 2,
        parentId: "backend",
        tags: ["python", "django", "flask", "fastapi", "pandas", "numpy", "pytest"],
        children: []
      },
      {
        id: "java",
        name: "Java",
        path: "/blog/backend/java",
        level: 2,
        parentId: "backend",
        tags: ["java", "spring", "springboot", "maven", "gradle", "junit"],
        children: []
      },
      {
        id: "go",
        name: "Go",
        path: "/blog/backend/go",
        level: 2,
        parentId: "backend",
        tags: ["go", "golang", "gin", "echo", "fiber", "goroutine", "channel"],
        children: []
      },
      {
        id: "database",
        name: "数据库",
        path: "/blog/backend/database",
        level: 2,
        parentId: "backend",
        tags: ["mysql", "postgresql", "mongodb", "redis", "sqlite", "sql", "nosql", "orm", "prisma", "typeorm"],
        children: []
      }
    ]
  },
  {
    id: "network",
    name: "计算机网络",
    path: "/blog/network",
    level: 1,
    parentId: null,
    tags: [],
    children: [
      {
        id: "http",
        name: "HTTP",
        path: "/blog/network/http",
        level: 2,
        parentId: "network",
        tags: ["http", "https", "http2", "http3", "rest", "graphql", "websocket", "cors", "csp"],
        children: []
      },
      {
        id: "tcp",
        name: "TCP/IP",
        path: "/blog/network/tcp",
        level: 2,
        parentId: "network",
        tags: ["tcp", "ip", "udp", "dns", "cdn", "load-balancer", "proxy", "vpn"],
        children: []
      },
      {
        id: "security",
        name: "网络安全",
        path: "/blog/network/security",
        level: 2,
        parentId: "network",
        tags: ["security", "ssl", "tls", "jwt", "oauth", "csrf", "xss", "sql-injection", "encryption"],
        children: []
      }
    ]
  },
  {
    id: "algorithm",
    name: "数据结构与算法",
    path: "/blog/algorithm",
    level: 1,
    parentId: null,
    tags: [],
    children: [
      {
        id: "data-structure",
        name: "数据结构",
        path: "/blog/algorithm/data-structure",
        level: 2,
        parentId: "algorithm",
        tags: ["array", "linked-list", "stack", "queue", "tree", "graph", "hash-table", "heap", "trie"],
        children: []
      },
      {
        id: "algorithm",
        name: "算法",
        path: "/blog/algorithm/algorithm",
        level: 2,
        parentId: "algorithm",
        tags: ["sorting", "searching", "dynamic-programming", "greedy", "backtracking", "dfs", "bfs", "dijkstra", "binary-search"],
        children: []
      },
      {
        id: "leetcode",
        name: "LeetCode",
        path: "/blog/algorithm/leetcode",
        level: 2,
        parentId: "algorithm",
        tags: ["leetcode", "easy", "medium", "hard", "interview", "coding"],
        children: []
      }
    ]
  },
  {
    id: "os",
    name: "计算机操作系统",
    path: "/blog/os",
    level: 1,
    parentId: null,
    tags: [],
    children: [
      {
        id: "linux",
        name: "Linux",
        path: "/blog/os/linux",
        level: 2,
        parentId: "os",
        tags: ["linux", "ubuntu", "centos", "debian", "shell", "bash", "zsh", "vim", "emacs"],
        children: []
      },
      {
        id: "windows",
        name: "Windows",
        path: "/blog/os/windows",
        level: 2,
        parentId: "os",
        tags: ["windows", "powershell", "cmd", "wsl", "registry"],
        children: []
      },
      {
        id: "process",
        name: "进程管理",
        path: "/blog/os/process",
        level: 2,
        parentId: "os",
        tags: ["process", "thread", "multiprocessing", "concurrency", "parallelism", "synchronization"],
        children: []
      }
    ]
  },
  {
    id: "computer-architecture",
    name: "计算机组成原理",
    path: "/blog/computer-architecture",
    level: 1,
    parentId: null,
    tags: [],
    children: [
      {
        id: "cpu",
        name: "CPU",
        path: "/blog/computer-architecture/cpu",
        level: 2,
        parentId: "computer-architecture",
        tags: ["cpu", "processor", "instruction", "pipeline", "cache", "memory-hierarchy"],
        children: []
      },
      {
        id: "memory",
        name: "内存",
        path: "/blog/computer-architecture/memory",
        level: 2,
        parentId: "computer-architecture",
        tags: ["memory", "ram", "rom", "cache", "virtual-memory", "memory-management"],
        children: []
      },
      {
        id: "storage",
        name: "存储",
        path: "/blog/computer-architecture/storage",
        level: 2,
        parentId: "computer-architecture",
        tags: ["storage", "disk", "ssd", "hdd", "file-system", "raid"],
        children: []
      }
    ]
  },
  {
    id: "design-patterns",
    name: "设计模式",
    path: "/blog/design-patterns",
    level: 1,
    parentId: null,
    tags: [],
    children: [
      {
        id: "creational",
        name: "创建型模式",
        path: "/blog/design-patterns/creational",
        level: 2,
        parentId: "design-patterns",
        tags: ["singleton", "factory", "builder", "prototype", "abstract-factory"],
        children: []
      },
      {
        id: "structural",
        name: "结构型模式",
        path: "/blog/design-patterns/structural",
        level: 2,
        parentId: "design-patterns",
        tags: ["adapter", "bridge", "composite", "decorator", "facade", "flyweight", "proxy"],
        children: []
      },
      {
        id: "behavioral",
        name: "行为型模式",
        path: "/blog/design-patterns/behavioral",
        level: 2,
        parentId: "design-patterns",
        tags: ["observer", "strategy", "command", "state", "template", "visitor", "mediator", "memento"],
        children: []
      }
    ]
  }
]

// 工具函数
export const getCategoryById = (id: string): Category | undefined => {
  const findCategory = (categories: Category[]): Category | undefined => {
    for (const category of categories) {
      if (category.id === id) return category
      const found = findCategory(category.children)
      if (found) return found
    }
    return undefined
  }
  return findCategory(categories)
}

export const getCategoriesByLevel = (level: number): Category[] => {
  const result: Category[] = []
  const findCategories = (cats: Category[]) => {
    for (const cat of cats) {
      if (cat.level === level) result.push(cat)
      findCategories(cat.children)
    }
  }
  findCategories(categories)
  return result
}

export const getSubCategories = (parentId: string): Category[] => {
  const parent = getCategoryById(parentId)
  return parent?.children || []
}

export const findCategoriesByTag = (tag: string): Category[] => {
  const result: Category[] = []
  const findCategories = (cats: Category[]) => {
    for (const cat of cats) {
      if (cat.tags.includes(tag)) result.push(cat)
      findCategories(cat.children)
    }
  }
  findCategories(categories)
  return result
}
