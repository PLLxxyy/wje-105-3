<template>
  <section class="grid gap-4 border-y border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-4 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
    <label class="flex flex-col gap-2 text-sm font-semibold text-[var(--color-muted)]">
      搜索
      <input
        class="field"
        type="search"
        :value="filters.search"
        @input="updateField('search', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <label v-if="showRecipeFilters" class="flex flex-col gap-2 text-sm font-semibold text-[var(--color-muted)]">
      基酒
      <select class="field" :value="filters.baseSpirit" @change="updateField('baseSpirit', ($event.target as HTMLSelectElement).value)">
        <option value="">全部基酒</option>
        <option v-for="spirit in baseSpiritOptions" :key="spirit" :value="spirit">{{ spirit }}</option>
      </select>
    </label>

    <label v-if="showCategory" class="flex flex-col gap-2 text-sm font-semibold text-[var(--color-muted)]">
      分类
      <select class="field" :value="filters.category" @change="updateField('category', ($event.target as HTMLSelectElement).value)">
        <option value="">全部分类</option>
        <option v-for="category in INGREDIENT_CATEGORY_OPTIONS" :key="category.value" :value="category.value">{{ category.label }}</option>
      </select>
    </label>

    <label class="flex flex-col gap-2 text-sm font-semibold text-[var(--color-muted)]">
      酒精度上限：{{ filters.maxAbv }}%
      <input
        type="range"
        min="0"
        max="45"
        step="1"
        :value="filters.maxAbv"
        class="accent-[var(--color-accent)]"
        @input="updateField('maxAbv', Number(($event.target as HTMLInputElement).value))"
      />
    </label>

    <div v-if="showRecipeFilters" class="flex flex-col gap-2 text-sm font-semibold text-[var(--color-muted)] md:col-span-2">
      难度
      <div class="flex flex-wrap gap-2">
        <button
          v-for="difficulty in DIFFICULTY_OPTIONS"
          :key="difficulty.value"
          type="button"
          class="chip"
          :class="{ 'chip-active': filters.difficulties.includes(difficulty.value) }"
          @click="toggleDifficulty(difficulty.value)"
        >
          {{ difficulty.label }}
        </button>
      </div>
    </div>

    <div v-if="showRecipeFilters" class="flex flex-col gap-2 text-sm font-semibold text-[var(--color-muted)] md:col-span-4">
      风格
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in STYLE_TAG_OPTIONS"
          :key="tag"
          type="button"
          class="chip"
          :class="{ 'chip-active': filters.tags.includes(tag) }"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { DIFFICULTY_OPTIONS, INGREDIENT_CATEGORY_OPTIONS, STYLE_TAG_OPTIONS } from '../../constants/enums';
import type { Difficulty } from '../../types/enums';
import type { FilterState } from '../../types/recipe';

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  baseSpiritOptions?: string[];
  showRecipeFilters?: boolean;
  showCategory?: boolean;
}

const props = withDefaults(defineProps<FilterBarProps>(), {
  baseSpiritOptions: () => [],
  showRecipeFilters: true,
  showCategory: false
});

const emit = defineEmits<{
  change: [filters: FilterState];
}>();

function commit(filters: FilterState): void {
  props.onChange(filters);
  emit('change', filters);
}

function updateField<K extends keyof FilterState>(key: K, value: FilterState[K]): void {
  commit({ ...props.filters, [key]: value });
}

function toggleDifficulty(difficulty: Difficulty): void {
  const difficulties = props.filters.difficulties.includes(difficulty)
    ? props.filters.difficulties.filter((item) => item !== difficulty)
    : [...props.filters.difficulties, difficulty];
  commit({ ...props.filters, difficulties });
}

function toggleTag(tag: string): void {
  const tags = props.filters.tags.includes(tag)
    ? props.filters.tags.filter((item) => item !== tag)
    : [...props.filters.tags, tag];
  commit({ ...props.filters, tags });
}
</script>
