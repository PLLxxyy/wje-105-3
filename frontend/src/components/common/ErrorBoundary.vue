<template>
  <div v-if="errorMessage" class="mx-auto max-w-3xl border border-red-300 bg-red-50 p-6 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
    <p class="text-sm font-semibold">页面渲染遇到问题</p>
    <h1 class="mt-2 font-display text-3xl">应用没有崩溃，数据仍保留在本地</h1>
    <p class="mt-3 text-sm leading-6 opacity-85">{{ errorMessage }}</p>
    <button type="button" class="mt-5 rounded-full bg-red-900 px-5 py-2 text-sm font-semibold text-white dark:bg-red-200 dark:text-red-950" @click="reset">
      返回页面
    </button>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

const errorMessage = ref('');

function reset(): void {
  errorMessage.value = '';
}

onErrorCaptured((error) => {
  errorMessage.value = error instanceof Error ? error.message : '未知渲染错误';
  return false;
});
</script>
