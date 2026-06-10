<template>
  <section class="flex min-h-64 flex-col items-center justify-center border border-dashed border-[var(--color-border)] bg-[var(--color-panel)] px-6 py-12 text-center">
    <div class="mb-4 text-5xl" aria-hidden="true">{{ icon }}</div>
    <h2 class="font-display text-2xl text-[var(--color-text)]">{{ title }}</h2>
    <p v-if="description" class="mt-2 max-w-xl text-sm leading-6 text-[var(--color-muted)]">{{ description }}</p>
    <button
      v-if="actionText && actionHandler"
      type="button"
      class="mt-6 rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-[var(--color-accent-text)] transition hover:-translate-y-0.5"
      @click="actionHandler"
    >
      {{ actionText }}
    </button>
  </section>
</template>

<script setup lang="ts">
interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionText?: string;
  actionHandler?: () => void;
}

withDefaults(defineProps<EmptyStateProps>(), {
  icon: '◇'
});
</script>
