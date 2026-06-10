<template>
  <div class="space-y-8">
    <section class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold uppercase text-[var(--color-muted)]">Ingredient library</p>
        <h1 class="font-display text-5xl text-[var(--color-text)]">材料库</h1>
      </div>
      <button type="button" class="action-link" @click="resetForm">清空表单</button>
    </section>

    <FilterBar
      :filters="filters"
      :on-change="updateFilters"
      :show-recipe-filters="false"
      show-category
    />

    <section class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div v-if="filtered.length" class="grid gap-4 md:grid-cols-2">
        <article v-for="ingredient in filtered" :key="ingredient.id" class="border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div class="flex items-start justify-between gap-4">
            <IngredientTag :ingredient="ingredient" />
            <span class="text-sm font-semibold text-[var(--color-muted)]">{{ INGREDIENT_CATEGORY_LABELS[ingredient.category] }}</span>
          </div>
          <p class="mt-4 text-sm leading-6 text-[var(--color-muted)]">{{ ingredient.description }}</p>
          <p class="mt-4 text-sm font-semibold text-[var(--color-text)]">{{ ingredient.abv }}% ABV</p>
          <div class="mt-5 flex gap-2">
            <button type="button" class="mini-button" :disabled="ingredientStore.isDefaultIngredient(ingredient.id)" @click="editIngredient(ingredient)">编辑</button>
            <button type="button" class="mini-button" :disabled="ingredientStore.isDefaultIngredient(ingredient.id)" @click="deleteIngredient(ingredient.id)">删除</button>
          </div>
        </article>
      </div>
      <EmptyState v-else title="没有符合条件的材料" description="调整搜索、分类或酒精度筛选。" />

      <form class="h-fit border border-[var(--color-border)] bg-[var(--color-panel)] p-5" @submit.prevent="saveIngredient">
        <p class="text-sm font-semibold text-[var(--color-muted)]">{{ editingId ? '编辑自定义材料' : '新增自定义材料' }}</p>
        <div class="mt-5 space-y-4">
          <label class="form-label">
            名称
            <input v-model.trim="form.name" class="field" :class="{ 'field-error': errorMessage }" type="text" />
          </label>
          <label class="form-label">
            分类
            <select v-model="form.category" class="field">
              <option v-for="category in INGREDIENT_CATEGORY_OPTIONS" :key="category.value" :value="category.value">{{ category.label }}</option>
            </select>
          </label>
          <label class="form-label">
            酒精度：{{ form.abv }}%
            <input v-model.number="form.abv" min="0" max="100" step="1" type="range" class="accent-[var(--color-accent)]" />
          </label>
          <label class="form-label">
            颜色
            <input v-model="form.color" class="h-12 w-full cursor-pointer rounded-none border border-[var(--color-border)] bg-transparent" type="color" />
          </label>
          <label class="form-label">
            描述
            <textarea v-model.trim="form.description" class="field min-h-24"></textarea>
          </label>
          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
          <button type="submit" class="action-link w-full bg-[var(--color-accent)] text-[var(--color-accent-text)]">{{ editingId ? '保存修改' : '新增材料' }}</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import EmptyState from '../components/common/EmptyState.vue';
import FilterBar from '../components/common/FilterBar.vue';
import IngredientTag from '../components/common/IngredientTag.vue';
import { INGREDIENT_CATEGORY, INGREDIENT_CATEGORY_LABELS, INGREDIENT_CATEGORY_OPTIONS } from '../constants/enums';
import { useFilter } from '../hooks/useFilter';
import { useIngredientStore, type IngredientPayload } from '../stores/useIngredientStore';
import type { Ingredient } from '../types/ingredient';
import type { IngredientCategory } from '../types/enums';
import type { FilterState } from '../types/recipe';

const ingredientStore = useIngredientStore();
const { ingredients } = storeToRefs(ingredientStore);
const editingId = ref<string | null>(null);
const errorMessage = ref('');

const form = reactive<IngredientPayload>({
  name: '',
  category: INGREDIENT_CATEGORY.BaseSpirit,
  abv: 40,
  description: '',
  color: '#C2772E'
});

function defaultFilters(): FilterState {
  return {
    search: '',
    baseSpirit: '',
    maxAbv: 100,
    difficulties: [],
    tags: [],
    category: ''
  };
}

function matchesIngredient(ingredient: Ingredient, activeFilters: FilterState): boolean {
  const search = activeFilters.search.trim().toLowerCase();
  const matchesSearch = !search || `${ingredient.name} ${ingredient.description}`.toLowerCase().includes(search);
  const matchesCategory = !activeFilters.category || ingredient.category === activeFilters.category;
  const matchesAbv = ingredient.abv <= activeFilters.maxAbv;
  return matchesSearch && matchesCategory && matchesAbv;
}

const { filtered, filters } = useFilter<Ingredient, FilterState>(ingredients, defaultFilters(), matchesIngredient);

function updateFilters(nextFilters: FilterState): void {
  filters.value = nextFilters;
}

function resetForm(): void {
  editingId.value = null;
  errorMessage.value = '';
  Object.assign(form, {
    name: '',
    category: INGREDIENT_CATEGORY.BaseSpirit as IngredientCategory,
    abv: 40,
    description: '',
    color: '#C2772E'
  });
}

function editIngredient(ingredient: Ingredient): void {
  if (ingredientStore.isDefaultIngredient(ingredient.id)) {
    return;
  }
  editingId.value = ingredient.id;
  errorMessage.value = '';
  Object.assign(form, {
    name: ingredient.name,
    category: ingredient.category,
    abv: ingredient.abv,
    description: ingredient.description,
    color: ingredient.color
  });
}

function deleteIngredient(id: string): void {
  ingredientStore.deleteIngredient(id);
  if (editingId.value === id) {
    resetForm();
  }
}

function saveIngredient(): void {
  if (!form.name.trim()) {
    errorMessage.value = '请填写材料名称。';
    return;
  }
  const payload: IngredientPayload = {
    name: form.name.trim(),
    category: form.category,
    abv: Math.max(0, Math.min(100, Number(form.abv))),
    description: form.description.trim(),
    color: form.color
  };

  if (editingId.value) {
    ingredientStore.updateIngredient(editingId.value, payload);
  } else {
    ingredientStore.addIngredient(payload);
  }
  resetForm();
}
</script>
