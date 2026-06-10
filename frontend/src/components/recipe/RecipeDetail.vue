<template>
  <section class="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_360px]">
    <div>
      <div class="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-muted)]">{{ recipe.baseSpirit }}</p>
          <h1 class="mt-3 font-display text-5xl leading-none text-[var(--color-text)]">{{ recipe.name }}</h1>
          <p class="mt-5 max-w-3xl text-base leading-8 text-[var(--color-muted)]">{{ recipe.description }}</p>
        </div>
        <GlassIcon :type="recipe.glassType" :size="92" class="text-[var(--color-accent)]" />
      </div>

      <div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div class="metric">
          <span>杯型</span>
          <strong>{{ formatGlassType(recipe.glassType) }}</strong>
        </div>
        <div class="metric">
          <span>方法</span>
          <strong>{{ formatMixMethod(recipe.method) }}</strong>
        </div>
        <div class="metric">
          <span>难度</span>
          <strong>{{ formatDifficulty(recipe.difficulty) }}</strong>
        </div>
        <div class="metric">
          <span>估算酒精度</span>
          <strong>{{ formatAbv(recipeAbv) }}</strong>
        </div>
      </div>

      <div class="mt-8 flex flex-wrap gap-2">
        <span v-for="tag in recipe.tags" :key="tag" class="rounded-full border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-muted)]">{{ tag }}</span>
      </div>

      <section class="mt-10">
        <h2 class="section-title">材料用量</h2>
        <div class="mt-4 grid gap-3">
          <div v-for="row in ingredientRows" :key="row.recipeIngredient.id" class="flex items-center justify-between border-b border-[var(--color-border)] py-3">
            <IngredientTag :ingredient="row.ingredient" :amount="row.recipeIngredient.amount" :unit="row.recipeIngredient.unit" />
            <span class="text-sm text-[var(--color-muted)]">{{ row.ingredient.description }}</span>
          </div>
        </div>
      </section>

      <section class="mt-10">
        <h2 class="section-title">调制步骤</h2>
        <ol class="mt-4 space-y-3">
          <li v-for="(step, index) in recipe.steps" :key="`${step}-${index}`" class="flex gap-4 border-l-2 border-[var(--color-accent)] pl-4 text-[var(--color-text)]">
            <span class="font-display text-2xl text-[var(--color-accent)]">{{ index + 1 }}</span>
            <span class="pt-1 leading-7">{{ step }}</span>
          </li>
        </ol>
      </section>
    </div>

    <aside class="h-fit border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
      <p class="text-sm font-semibold text-[var(--color-muted)]">装饰物</p>
      <p class="mt-2 text-lg font-semibold text-[var(--color-text)]">{{ recipe.garnish }}</p>
      <p class="mt-5 text-sm text-[var(--color-muted)]">创建：{{ formatDate(recipe.createdAt) }}</p>
      <p class="mt-1 text-sm text-[var(--color-muted)]">更新：{{ formatDate(recipe.updatedAt) }}</p>

      <div class="mt-6 grid gap-3">
        <RouterLink class="action-link bg-[var(--color-accent)] text-[var(--color-accent-text)]" :to="`/animation?recipe=${recipe.id}`">调制演示</RouterLink>
        <RouterLink class="action-link" :to="`/recipes/${recipe.id}/edit`">编辑配方</RouterLink>
        <RouterLink class="action-link" :to="`/compare?left=${recipe.id}`">加入对比</RouterLink>
        <button type="button" class="action-link" @click="emit('favorite', recipe.id)">{{ collected ? '取消快速收藏' : '快速收藏' }}</button>
        <button type="button" class="action-link" @click="emit('schedule', recipe.id)">安排排期</button>
        <button type="button" class="action-link text-red-700 dark:text-red-300" @click="emit('delete', recipe.id)">删除配方</button>
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import GlassIcon from '../common/GlassIcon.vue';
import IngredientTag from '../common/IngredientTag.vue';
import type { Ingredient } from '../../types/ingredient';
import type { CocktailRecipe, RecipeIngredient } from '../../types/recipe';
import { calculateRecipeAbv } from '../../utils/abvCalculator';
import { formatAbv, formatDate, formatDifficulty, formatGlassType, formatMixMethod } from '../../utils/format';

interface RecipeDetailProps {
  recipe: CocktailRecipe;
  ingredients: Ingredient[];
  collected?: boolean;
}

const props = withDefaults(defineProps<RecipeDetailProps>(), {
  collected: false
});

const emit = defineEmits<{
  favorite: [recipeId: string];
  delete: [recipeId: string];
  schedule: [recipeId: string];
}>();

interface IngredientRow {
  recipeIngredient: RecipeIngredient;
  ingredient: Ingredient;
}

const ingredientRows = computed<IngredientRow[]>(() => {
  const ingredientMap = new Map(props.ingredients.map((ingredient) => [ingredient.id, ingredient]));
  return props.recipe.ingredients
    .map((recipeIngredient) => {
      const ingredient = ingredientMap.get(recipeIngredient.ingredientId);
      return ingredient ? { recipeIngredient, ingredient } : undefined;
    })
    .filter((row): row is IngredientRow => Boolean(row));
});

const recipeAbv = computed(() => calculateRecipeAbv(props.recipe, props.ingredients));
</script>
