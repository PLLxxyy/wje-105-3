<template>
  <div v-if="recipe" class="space-y-8">
    <RecipeDetailPanel
      :recipe="recipe"
      :ingredients="ingredients"
      :collected="collectionStore.isRecipeCollected(recipe.id)"
      @favorite="collectionStore.quickToggleFavorite"
      @delete="deleteCurrentRecipe"
      @schedule="openSchedulePicker"
    />

    <section class="border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-[var(--color-muted)]">收藏管理</p>
          <h2 class="section-title">加入指定收藏夹</h2>
        </div>
        <div class="flex flex-wrap gap-3">
          <select v-model="selectedCollectionId" class="field min-w-48">
            <option v-for="collection in collections" :key="collection.id" :value="collection.id">{{ collection.name }}</option>
          </select>
          <input v-model.trim="newCollectionName" class="field min-w-52" type="text" />
          <button type="button" class="action-link bg-[var(--color-accent)] text-[var(--color-accent-text)]" @click="addToCollection">加入</button>
        </div>
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <button
          v-for="collection in collectionsContainingRecipe"
          :key="collection.id"
          type="button"
          class="chip chip-active"
          @click="collectionStore.removeRecipeFromCollection(collection.id, recipe.id)"
        >
          {{ collection.name }} ×
        </button>
      </div>
    </section>

    <SchedulePicker
      :visible="schedulePickerVisible"
      :recipe-id="recipe.id"
      :recipe-name="recipe.name"
      @close="schedulePickerVisible = false"
    />
  </div>

  <EmptyState
    v-else
    icon="?"
    title="没有找到这个配方"
    description="它可能已经被删除，或链接里的 ID 不存在。"
    action-text="返回配方列表"
    :action-handler="goRecipes"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import EmptyState from '../components/common/EmptyState.vue';
import SchedulePicker from '../components/common/SchedulePicker.vue';
import RecipeDetailPanel from '../components/recipe/RecipeDetail.vue';
import { useCollectionStore } from '../stores/useCollectionStore';
import { useIngredientStore } from '../stores/useIngredientStore';
import { useRecipeStore } from '../stores/useRecipeStore';
import { useScheduleStore } from '../stores/useScheduleStore';

const route = useRoute();
const router = useRouter();
const recipeStore = useRecipeStore();
const ingredientStore = useIngredientStore();
const collectionStore = useCollectionStore();
const scheduleStore = useScheduleStore();
const { ingredients } = storeToRefs(ingredientStore);
const { sortedCollections: collections } = storeToRefs(collectionStore);

const selectedCollectionId = ref(collections.value[0]?.id ?? '');
const newCollectionName = ref('');
const schedulePickerVisible = ref(false);

const recipe = computed(() => recipeStore.getRecipeById(String(route.params.id)));

const collectionsContainingRecipe = computed(() => {
  if (!recipe.value) {
    return [];
  }
  return collections.value.filter((collection) => collection.recipeIds.includes(recipe.value!.id));
});

watch(
  recipe,
  (currentRecipe) => {
    if (currentRecipe) {
      recipeStore.markViewed(currentRecipe.id);
    }
  },
  { immediate: true }
);

watch(
  collections,
  (items) => {
    if (!selectedCollectionId.value && items[0]) {
      selectedCollectionId.value = items[0].id;
    }
  },
  { immediate: true }
);

function addToCollection(): void {
  if (!recipe.value) {
    return;
  }
  const name = newCollectionName.value.trim();
  const collectionId = name ? collectionStore.createCollection(name).id : selectedCollectionId.value;
  if (!collectionId) {
    return;
  }
  selectedCollectionId.value = collectionId;
  newCollectionName.value = '';
  collectionStore.addRecipeToCollection(collectionId, recipe.value.id);
}

function openSchedulePicker(): void {
  schedulePickerVisible.value = true;
}

function deleteCurrentRecipe(recipeId: string): void {
  recipeStore.deleteRecipe(recipeId);
  collectionStore.removeRecipeEverywhere(recipeId);
  scheduleStore.removeRecipeFromSchedule(recipeId);
  void router.push('/recipes');
}

function goRecipes(): void {
  void router.push('/recipes');
}
</script>
