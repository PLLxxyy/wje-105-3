<template>
  <div v-if="recipe" class="space-y-6">
    <header>
      <p class="text-sm font-semibold uppercase text-[var(--color-muted)]">Recipe editor</p>
      <h1 class="font-display text-5xl text-[var(--color-text)]">编辑配方</h1>
    </header>
    <RecipeForm :ingredients="ingredients" :initial-recipe="recipe" mode="edit" @save="saveRecipe" @cancel="goDetail" />
  </div>
  <EmptyState
    v-else
    title="配方不可编辑"
    description="没有找到要编辑的配方。"
    action-text="返回配方列表"
    :action-handler="goRecipes"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import EmptyState from '../components/common/EmptyState.vue';
import RecipeForm from '../components/recipe/RecipeForm.vue';
import { useIngredientStore } from '../stores/useIngredientStore';
import { useRecipeStore } from '../stores/useRecipeStore';
import type { RecipePayload } from '../types/recipe';

const route = useRoute();
const router = useRouter();
const recipeStore = useRecipeStore();
const ingredientStore = useIngredientStore();
const { ingredients } = storeToRefs(ingredientStore);
const recipe = computed(() => recipeStore.getRecipeById(String(route.params.id)));

function saveRecipe(payload: RecipePayload): void {
  const updatedRecipe = recipe.value ? recipeStore.updateRecipe(recipe.value.id, payload) : undefined;
  if (updatedRecipe) {
    void router.push(`/recipes/${updatedRecipe.id}`);
  }
}

function goDetail(): void {
  if (recipe.value) {
    void router.push(`/recipes/${recipe.value.id}`);
  }
}

function goRecipes(): void {
  void router.push('/recipes');
}
</script>
