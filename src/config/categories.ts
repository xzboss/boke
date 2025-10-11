/**
 * 文章分类
 * 只有叶子节点才是文章
 */
export interface Category {
  /** 分类ID */
  id: string;
  /** 分类名称 */
  name: string;
  /** 父分类ID */
  parentId: string | null;
  /** 类型*/
  type: "article" | "menu";
  /** 标签 */
  tags: string[];
  /** 子分类 */
  children: Category[];
}

export interface Article extends Category {
  /** 文章路径 */
  path: string;
}

export const categories: Category[] = [
  {
    id: "frontend",
    name: "UI测试",
    parentId: null,
    tags: [],
    type: "menu",
    children: [
      {
        id: "vue",
        name: "Vue测试",
        parentId: "frontend",
        tags: [
          "vue",
          "vue3",
          "composition-api",
          "pinia",
          "vue-router",
          "nuxt",
          "vite-vue",
        ],
        type: "menu",
        children: [
          {
            id: "vue-basics",
            name: "测试用例1",
            parentId: "vue",
            tags: ["vue", "vue3", "响应式", "proxy", "hot"],
            type: "menu",
            children: [],
          },
          {
            id: "vue-router-guide",
            name: "测试用例2",
            parentId: "vue",
            tags: ["vue", "vue-router", "路由", "导航守卫"],
            type: "menu",
            children: [],
          },
        ],
      },
      {
        id: "react",
        name: "React测试",
        parentId: "frontend",
        tags: [
          "react",
          "jsx",
          "hooks",
          "redux",
          "nextjs",
          "gatsby",
          "vite-react",
        ],
        type: "menu",
        children: [
          {
            id: "react-hooks",
            name: "测试用例3",
            parentId: "react",
            tags: ["react", "hooks", "useState", "useEffect", "custom-hooks"],
            type: "menu",
            children: [],
          },
          {
            id: "react-performance",
            name: "测试用例4",
            parentId: "react",
            tags: ["react", "性能优化", "memo", "useMemo", "useCallback"],
            type: "menu",
            children: [],
          },
        ],
      },
      {
        id: "vite",
        name: "自动化测试工具",
        parentId: "frontend",
        tags: [
          "vite",
          "vite-vue",
          "vite-react",
          "rollup",
          "esbuild",
          "hmr",
          "hot",
        ],
        type: "menu",
        children: [],
      },
      {
        id: "javascript",
        name: "测试用例5",
        parentId: "frontend",
        tags: ["js", "javascript", "async", "promise", "es6", "hot"],
        type: "menu",
        children: [],
      },
      {
        id: "typescript",
        name: "测试用例6",
        parentId: "frontend",
        tags: ["ts", "typescript", "interface", "type", "generic"],
        type: "menu",
        children: [],
      },
      {
        id: "css",
        name: "测试类型",
        parentId: "frontend",
        tags: ["css", "css3", "flexbox", "grid", "animation"],
        type: "menu",
        children: [
          {
            id: "css-layout",
            name: "测试用例7",
            parentId: "css",
            tags: ["css", "flexbox", "grid", "布局"],
            type:'menu',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "backend",
    name: "接口测试",
    parentId: null,
    tags: [],
    type: "menu",
    children: [
      {
        id: "nodejs",
        name: "Node.js测试",
        parentId: "backend",
        tags: ["nodejs", "express", "koa", "nest"],
        type: "menu",
        children: [
          {
            id: "nodejs-stream",
            name: "测试用例8",
            parentId: "nodejs",
            tags: ["nodejs", "stream", "buffer", "pipe"],
            type: "menu",
            children: [],
          },
        ],
      },
    ],
  },
];

/**
 * 根据 ID 获取分类
 * @param id
 * @returns
 */
export const getCategoryById = (id: string): Category | undefined => {
  const findCategory = (categories: Category[]): Category | undefined => {
    for (const category of categories) {
      if (category.id === id) return category;
      const found = findCategory(category.children);
      if (found) return found;
    }
    return undefined;
  };
  return findCategory(categories);
};

/**
 * 根据层级获取分类
 * @param level 层级
 * @returns 分类
 */
export const getCategoriesByLevel = (level: number): Category[] => {
  const result: Category[] = [];
  const findCategories = (cats: Category[]) => {
    for (const cat of cats) {
      if (cat.level === level) result.push(cat);
      findCategories(cat.children);
    }
  };
  findCategories(categories);
  return result;
};

/**
 * 根据父 ID 获取子分类
 * @param parentId 父 ID
 * @returns 子分类
 */
export const getSubCategories = (parentId: string): Category[] => {
  const parent = getCategoryById(parentId);
  return parent?.children || [];
};

/**
 * 根据标签获取分类
 * @param tag 标签
 * @returns 分类
 */
export const findCategoriesByTag = (tag: string): Category[] => {
  const result: Category[] = [];
  const findCategories = (cats: Category[]) => {
    for (const cat of cats) {
      if (cat.tags.includes(tag)) result.push(cat);
      findCategories(cat.children);
    }
  };
  findCategories(categories);
  return result;
};
