<template>
  <div class="space-y-8">
    <section class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold uppercase text-[var(--color-muted)]">Recipe comparison</p>
        <h1 class="font-display text-5xl text-[var(--color-text)]">配方对比</h1>
      </div>
      <div class="grid gap-3 md:grid-cols-2">
        <select v-model="leftId" class="field min-w-64">
          <option v-for="recipe in recipes" :key="recipe.id" :value="recipe.id">{{ recipe.name }}</option>
        </select>
        <select v-model="rightId" class="field min-w-64">
          <option v-for="recipe in recipes" :key="recipe.id" :value="recipe.id">{{ recipe.name }}</option>
        </select>
      </div>
    </section>

    <RecipeComparePanel :left="leftRecipe" :right="rightRecipe" :ingredients="ingredients" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import RecipeComparePanel from '../components/recipe/RecipeCompare.vue';
import { useIngredientStore } from '../stores/useIngredientStore';
import { useRecipeStore } from '../stores/useRecipeStore';

const route = useRoute();
const recipeStore = useRecipeStore();
const ingredientStore = useIngredientStore();
const { sortedRecipes: recipes } = storeToRefs(recipeStore);
const { ingredients } = storeToRefs(ingredientStore);

const leftId = ref(String(route.query.left ?? recipes.value[0]?.id ?? ''));
const rightId = ref(String(route.query.right ?? recipes.value[1]?.id ?? recipes.value[0]?.id ?? ''));

const leftRecipe = computed(() => recipes.value.find((recipe) => recipe.id === leftId.value) ?? null);
const rightRecipe = computed(() => recipes.value.find((recipe) => recipe.id === rightId.value) ?? null);

watch(
  recipes,
  (items) => {
    if (!leftId.value && items[0]) {
      leftId.value = items[0].id;
    }
    if (!rightId.value && items[1]) {
      rightId.value = items[1].id;
    }
  },
  { immediate: true }
);
</script>
