<template>
  <div class="space-y-6">
    <header>
      <p class="text-sm font-semibold uppercase text-[var(--color-muted)]">Recipe editor</p>
      <h1 class="font-display text-5xl text-[var(--color-text)]">创建配方</h1>
    </header>
    <RecipeForm :ingredients="ingredients" mode="create" @save="saveRecipe" @cancel="goRecipes" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import RecipeForm from '../components/recipe/RecipeForm.vue';
import { useIngredientStore } from '../stores/useIngredientStore';
import { useRecipeStore } from '../stores/useRecipeStore';
import type { RecipePayload } from '../types/recipe';

const router = useRouter();
const recipeStore = useRecipeStore();
const ingredientStore = useIngredientStore();
const { ingredients } = storeToRefs(ingredientStore);

function saveRecipe(payload: RecipePayload): void {
  const recipe = recipeStore.addRecipe(payload);
  void router.push(`/recipes/${recipe.id}`);
}

function goRecipes(): void {
  void router.push('/recipes');
}
</script>
