<template>
  <button
    type="button"
    class="relative inline-flex h-10 w-20 items-center rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-1 transition"
    :aria-label="theme.theme === THEME_MODE.Dark ? '切换亮色主题' : '切换暗色主题'"
    @click="theme.toggleTheme"
  >
    <span
      class="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-accent)] text-sm text-[var(--color-accent-text)] transition-transform duration-300"
      :class="theme.theme === THEME_MODE.Dark ? 'translate-x-10' : 'translate-x-0'"
    >
      {{ theme.theme === THEME_MODE.Dark ? '月' : '日' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { THEME_MODE } from '../../constants/enums';
import { useThemeStore } from '../../stores/useThemeStore';

const theme = useThemeStore();
</script>
