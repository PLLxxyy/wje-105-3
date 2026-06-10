<template>
  <div class="space-y-6">
    <section class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold uppercase text-[var(--color-muted)]">Recipe browser</p>
        <h1 class="font-display text-5xl text-[var(--color-text)]">配方浏览</h1>
      </div>
      <div class="flex gap-3">
        <button type="button" class="action-link" @click="resetFilters">重置筛选</button>
        <RouterLink class="action-link bg-[var(--color-accent)] text-[var(--color-accent-text)]" to="/recipes/new">新建配方</RouterLink>
      </div>
    </section>

    <FilterBar
      :filters="filters"
      :on-change="updateFilters"
      :base-spirit-options="baseSpiritOptions"
    />

    <div v-if="filtered.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <RecipeCard
        v-for="recipe in filtered"
        :key="recipe.id"
        :recipe="recipe"
        :ingredients="ingredients"
        :collected="collectionStore.isRecipeCollected(recipe.id)"
        @favorite="collectionStore.quickToggleFavorite"
      />
    </div>

    <EmptyState
      v-else
      icon="∅"
      title="没有符合条件的配方"
      description="减少筛选条件，或创建一个新的调酒配方。"
      action-text="创建配方"
      :action-handler="goCreate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import EmptyState from '../components/common/EmptyState.vue';
import FilterBar from '../components/common/FilterBar.vue';
import RecipeCard from '../components/recipe/RecipeCard.vue';
import { useFilter } from '../hooks/useFilter';
import { useCollectionStore } from '../stores/useCollectionStore';
import { useIngredientStore } from '../stores/useIngredientStore';
import { useRecipeStore } from '../stores/useRecipeStore';
import type { CocktailRecipe, FilterState } from '../types/recipe';
import { calculateRecipeAbv } from '../utils/abvCalculator';

const router = useRouter();
const recipeStore = useRecipeStore();
const ingredientStore = useIngredientStore();
const collectionStore = useCollectionStore();
const { sortedRecipes } = storeToRefs(recipeStore);
const { ingredients } = storeToRefs(ingredientStore);

function defaultFilters(): FilterState {
  return {
    search: '',
    baseSpirit: '',
    maxAbv: 45,
    difficulties: [],
    tags: [],
    category: ''
  };
}

function matchesRecipe(recipe: CocktailRecipe, activeFilters: FilterState): boolean {
  const search = activeFilters.search.trim().toLowerCase();
  const searchable = [recipe.name, recipe.description, recipe.baseSpirit, ...recipe.tags].join(' ').toLowerCase();
  const matchesSearch = !search || searchable.includes(search);
  const matchesSpirit = !activeFilters.baseSpirit || recipe.baseSpirit === activeFilters.baseSpirit;
  const matchesDifficulty = activeFilters.difficulties.length === 0 || activeFilters.difficulties.includes(recipe.difficulty);
  const matchesTags = activeFilters.tags.length === 0 || activeFilters.tags.every((tag) => recipe.tags.includes(tag));
  const matchesAbv = calculateRecipeAbv(recipe, ingredients.value) <= activeFilters.maxAbv;
  return matchesSearch && matchesSpirit && matchesDifficulty && matchesTags && matchesAbv;
}

const { filtered, filters, resetFilters } = useFilter<CocktailRecipe, FilterState>(sortedRecipes, defaultFilters(), matchesRecipe);

const baseSpiritOptions = computed(() => [...new Set(sortedRecipes.value.map((recipe) => recipe.baseSpirit))].sort());

function updateFilters(nextFilters: FilterState): void {
  filters.value = nextFilters;
}

function goCreate(): void {
  void router.push('/recipes/new');
}
</script>
