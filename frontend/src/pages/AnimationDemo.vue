<template>
  <div class="space-y-8">
    <section class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold uppercase text-[var(--color-muted)]">Layer animation</p>
        <h1 class="font-display text-5xl text-[var(--color-text)]">调制动画演示</h1>
      </div>
      <select v-model="selectedRecipeId" class="field min-w-72">
        <option v-for="recipe in recipes" :key="recipe.id" :value="recipe.id">{{ recipe.name }}</option>
      </select>
    </section>

    <PourAnimation
      v-if="selectedRecipe"
      :key="selectedRecipe.id"
      :recipe="selectedRecipe"
      :ingredients="ingredients"
    />
    <EmptyState v-else title="暂无可演示配方" description="创建配方后即可播放分层调制动画。" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import EmptyState from '../components/common/EmptyState.vue';
import PourAnimation from '../components/animation/PourAnimation.vue';
import { useIngredientStore } from '../stores/useIngredientStore';
import { useRecipeStore } from '../stores/useRecipeStore';

const route = useRoute();
const recipeStore = useRecipeStore();
const ingredientStore = useIngredientStore();
const { sortedRecipes: recipes } = storeToRefs(recipeStore);
const { ingredients } = storeToRefs(ingredientStore);

const selectedRecipeId = ref(String(route.query.recipe ?? recipes.value[0]?.id ?? ''));
const selectedRecipe = computed(() => recipes.value.find((recipe) => recipe.id === selectedRecipeId.value) ?? null);

watch(
  recipes,
  (items) => {
    if (!selectedRecipeId.value && items[0]) {
      selectedRecipeId.value = items[0].id;
    }
  },
  { immediate: true }
);
</script>
