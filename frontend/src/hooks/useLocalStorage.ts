import { ref, watch, type Ref } from 'vue';

const storageError = ref<string | null>(null);

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

function reportStorageError(message: string): void {
  storageError.value = message;
}

export function useStorageError(): { storageError: Ref<string | null>; clearStorageError: () => void } {
  return {
    storageError,
    clearStorageError: () => {
      storageError.value = null;
    }
  };
}

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const state = ref(cloneValue(defaultValue)) as Ref<T>;

  if (typeof window !== 'undefined') {
    try {
      const rawValue = window.localStorage.getItem(key);
      if (rawValue !== null) {
        state.value = JSON.parse(rawValue) as T;
      } else {
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    } catch {
      state.value = cloneValue(defaultValue);
      reportStorageError('浏览器存储暂时不可用，已使用内存数据继续运行。');
    }
  }

  watch(
    state,
    (value) => {
      if (typeof window === 'undefined') {
        return;
      }
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        reportStorageError('保存到本地存储失败，请清理浏览器空间后重试。');
      }
    },
    { deep: true }
  );

  return state;
}
