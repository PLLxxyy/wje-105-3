# 调酒配方实验室

一个纯前端的鸡尾酒配方管理与调制动画演示平台。

## 主要功能

- 配方浏览、搜索、标签/难度/基酒/酒精度筛选
- 配方详情、创建、编辑、删除与本地持久化
- 材料库 CRUD，支持预置材料与自定义材料管理
- 收藏夹创建、删除、加入/移出配方
- 分层倒入调制动画，支持播放、暂停、重播
- 左右配方对比，高亮杯型、方法、ABV 与材料差异
- 亮色/暗色主题切换
- localStorage 异常提示与 Vue 错误边界

## 本地开发方式

```bash
cd frontend
npm install
npm run dev
```

访问地址：`http://localhost:28605`

## 技术栈

| 技术 | 用途 |
| --- | --- |
| Vue 3 | SPA 视图层 |
| TypeScript | 类型约束 |
| Pinia | 状态管理 |
| Vite | 开发服务器与构建 |
| Tailwind CSS | 样式系统 |
| localStorage | 浏览器本地持久化 |

## 项目目录结构

```text
wjecocktaillab/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env
│   ├── public/
│   │   └── favicon.ico
│   └── src/
│       ├── main.ts
│       ├── App.vue
│       ├── router/
│       │   └── index.ts
│       ├── stores/
│       │   ├── useRecipeStore.ts
│       │   ├── useIngredientStore.ts
│       │   ├── useCollectionStore.ts
│       │   └── useThemeStore.ts
│       ├── types/
│       │   ├── recipe.ts
│       │   ├── ingredient.ts
│       │   ├── collection.ts
│       │   └── enums.ts
│       ├── constants/
│       │   ├── enums.ts
│       │   └── defaultIngredients.ts
│       ├── components/
│       │   ├── common/
│       │   │   ├── GlassIcon.vue
│       │   │   ├── IngredientTag.vue
│       │   │   ├── EmptyState.vue
│       │   │   ├── FilterBar.vue
│       │   │   ├── ThemeToggle.vue
│       │   │   └── ErrorBoundary.vue
│       │   ├── recipe/
│       │   │   ├── RecipeCard.vue
│       │   │   ├── RecipeDetail.vue
│       │   │   ├── RecipeForm.vue
│       │   │   └── RecipeCompare.vue
│       │   └── animation/
│       │       ├── PourAnimation.vue
│       │       └── LayerVisualizer.vue
│       ├── hooks/
│       │   ├── useLocalStorage.ts
│       │   ├── useFilter.ts
│       │   └── useAnimation.ts
│       ├── pages/
│       │   ├── Home.vue
│       │   ├── RecipeList.vue
│       │   ├── RecipeDetail.vue
│       │   ├── RecipeCreate.vue
│       │   ├── RecipeEdit.vue
│       │   ├── IngredientLibrary.vue
│       │   ├── Collections.vue
│       │   ├── AnimationDemo.vue
│       │   └── RecipeCompare.vue
│       ├── utils/
│       │   ├── abvCalculator.ts
│       │   ├── storage.ts
│       │   └── format.ts
│       ├── styles/
│       │   ├── theme.css
│       │   └── animations.css
│       └── mock/
│           └── defaultRecipes.ts
├── .gitignore
└── README.md
```

## 预置数据说明

应用首次启动时会写入 20 种调酒材料和 8 个经典鸡尾酒配方。后续新增、编辑、收藏和主题偏好都会通过 Pinia store 同步到浏览器 localStorage。

## License

MIT
