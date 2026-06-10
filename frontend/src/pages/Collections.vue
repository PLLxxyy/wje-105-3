<template>
  <div class="space-y-8">
    <section class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold uppercase text-[var(--color-muted)]">Collections</p>
        <h1 class="font-display text-5xl text-[var(--color-text)]">收藏夹</h1>
      </div>
      <form class="flex gap-2" @submit.prevent="createCollection">
        <input v-model.trim="collectionName" class="field min-w-56" type="text" />
        <button type="submit" class="action-link bg-[var(--color-accent)] text-[var(--color-accent-text)]">新建</button>
      </form>
    </section>

    <div v-if="collections.length" class="space-y-6">
      <section v-for="collection in collections" :key="collection.id" class="border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="font-display text-3xl text-[var(--color-text)]">{{ collection.name }}</h2>
            <p class="mt-1 text-sm text-[var(--color-muted)]">{{ collection.recipeIds.length }} 个配方</p>
          </div>
          <button type="button" class="mini-button" @click="collectionStore.deleteCollection(collection.id)">删除收藏夹</button>
        </div>

        <div v-if="recipesForCollection(collection.recipeIds).length" class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article v-for="recipe in recipesForCollection(collection.recipeIds)" :key="recipe.id" class="border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <RouterLink :to="`/recipes/${recipe.id}`" class="font-display text-2xl text-[var(--color-text)]">{{ recipe.name }}</RouterLink>
            <p class="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">{{ recipe.description }}</p>
            <button type="button" class="mini-button mt-4" @click="collectionStore.removeRecipeFromCollection(collection.id, recipe.id)">移出</button>
          </article>
        </div>
        <EmptyState
          v-else
          icon="□"
          title="这个收藏夹还是空的"
          description="在配方详情页选择收藏夹，或在配方卡片上快速收藏。"
        />
      </section>
    </div>
    <EmptyState v-else title="还没有收藏夹" description="创建一个收藏夹后，就能按场景整理配方。" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import EmptyState from '../components/common/EmptyState.vue';
import { useCollectionStore } from '../stores/useCollectionStore';
import { useRecipeStore } from '../stores/useRecipeStore';
import type { CocktailRecipe } from '../types/recipe';

const collectionStore = useCollectionStore();
const recipeStore = useRecipeStore();
const { sortedCollections: collections } = storeToRefs(collectionStore);
const { recipes } = storeToRefs(recipeStore);
const collectionName = ref('');

function recipesForCollection(recipeIds: string[]): CocktailRecipe[] {
  return recipeIds
    .map((id) => recipes.value.find((recipe) => recipe.id === id))
    .filter((recipe): recipe is CocktailRecipe => Boolean(recipe));
}

function createCollection(): void {
  if (!collectionName.value) {
    return;
  }
  collectionStore.createCollection(collectionName.value);
  collectionName.value = '';
}
</script>
