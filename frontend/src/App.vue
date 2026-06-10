<template>
  <div class="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
    <header class="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/92 backdrop-blur">
      <nav class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <RouterLink to="/" class="font-display text-2xl text-[var(--color-text)]">调酒配方实验室</RouterLink>
        <div class="flex flex-wrap items-center gap-2 text-sm font-semibold">
          <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-link">{{ item.label }}</RouterLink>
          <ThemeToggle />
        </div>
      </nav>
    </header>

    <div v-if="storageError" class="border-b border-amber-300 bg-amber-100 px-4 py-3 text-sm text-amber-950">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <span>{{ storageError }}</span>
        <button type="button" class="font-semibold" @click="clearStorageError">关闭</button>
      </div>
    </div>

    <main class="mx-auto max-w-7xl px-4 py-8">
      <ErrorBoundary>
        <RouterView />
      </ErrorBoundary>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ErrorBoundary from './components/common/ErrorBoundary.vue';
import ThemeToggle from './components/common/ThemeToggle.vue';
import { useStorageError } from './hooks/useLocalStorage';
import { useThemeStore } from './stores/useThemeStore';

const navItems = [
  { to: '/recipes', label: '配方' },
  { to: '/recipes/new', label: '创建' },
  { to: '/ingredients', label: '材料库' },
  { to: '/collections', label: '收藏夹' },
  { to: '/animation', label: '动画' },
  { to: '/compare', label: '对比' }
] as const;

const theme = useThemeStore();
const { storageError, clearStorageError } = useStorageError();

onMounted(() => {
  theme.initializeTheme();
});
</script>
