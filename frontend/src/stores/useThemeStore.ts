import { watch } from 'vue';
import { defineStore } from 'pinia';
import { THEME_MODE } from '../constants/enums';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';
import type { ThemeMode } from '../types/enums';

export const useThemeStore = defineStore('theme', () => {
  const theme = useLocalStorage<ThemeMode>(STORAGE_KEYS.theme, THEME_MODE.Light);

  function applyTheme(mode: ThemeMode): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.classList.toggle(THEME_MODE.Dark, mode === THEME_MODE.Dark);
    document.documentElement.dataset.theme = mode;
  }

  function toggleTheme(): void {
    theme.value = theme.value === THEME_MODE.Dark ? THEME_MODE.Light : THEME_MODE.Dark;
  }

  function initializeTheme(): void {
    applyTheme(theme.value);
  }

  watch(theme, applyTheme, { immediate: true });

  return {
    theme,
    toggleTheme,
    initializeTheme
  };
});
