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
        children: [
          {
            id: "vue-basics",
            name: "Vue 3 响应式原理",
            path: "/blog/frontend/vue/basics",
            level: 3,
            parentId: "vue",
            tags: ["vue", "vue3", "响应式", "proxy"],
            children: []
          }
        ]
      },
      {
        id: "react",
        name: "React",
        path: "/blog/frontend/react",
        level: 2,
        parentId: "frontend",
        tags: ["react", "jsx", "hooks", "redux", "nextjs", "gatsby", "vite-react"],
        children: [
          {
            id: "react-hooks",
            name: "React Hooks 完全指南",
            path: "/blog/frontend/react/hooks",
            level: 3,
            parentId: "react",
            tags: ["react", "hooks", "useState", "useEffect", "custom-hooks"],
            children: []
          }
        ]
      },
      {
        id: "vite",
        name: "Vite 构建工具",
        path: "/blog/frontend/vite",
        level: 2,
        parentId: "frontend",
        tags: ["vite", "vite-vue", "vite-react", "rollup", "esbuild", "hmr", "hot"],
        children: []
      },
      {
        id: "javascript",
        name: "JavaScript 异步编程",
        path: "/blog/frontend/javascript",
        level: 2,
        parentId: "frontend",
        tags: ["js", "javascript", "async", "promise", "es6", "hot"],
        children: []
      },
      {
        id: "typescript",
        name: "TypeScript 类型系统",
        path: "/blog/frontend/typescript",
        level: 2,
        parentId: "frontend",
        tags: ["ts", "typescript", "interface", "type", "generic"],
        children: []
      }
    ]
  }
]

/**
 * 根据 ID 获取分类
 * @param id 
 * @returns 
 */
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

/**
 * 根据层级获取分类
 * @param level 层级
 * @returns 分类
 */
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

/**
 * 根据父 ID 获取子分类
 * @param parentId 父 ID
 * @returns 子分类
 */
export const getSubCategories = (parentId: string): Category[] => {
  const parent = getCategoryById(parentId)
  return parent?.children || []
}

/**
 * 根据标签获取分类
 * @param tag 标签
 * @returns 分类
 */
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
