import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';
import type { Collection } from '../types/collection';

function createId(): string {
  return crypto.randomUUID();
}

export const useCollectionStore = defineStore('collections', () => {
  const collections = useLocalStorage<Collection[]>(STORAGE_KEYS.collections, [
    {
      id: 'c1111111-1111-4111-8111-111111111111',
      name: '我的收藏',
      recipeIds: [],
      createdAt: 1717200000000
    }
  ]);

  const sortedCollections = computed(() => [...collections.value].sort((left, right) => left.createdAt - right.createdAt));

  function createCollection(name: string): Collection {
    const collection: Collection = {
      id: createId(),
      name: name.trim(),
      recipeIds: [],
      createdAt: Date.now()
    };
    collections.value = [...collections.value, collection];
    return collection;
  }

  function deleteCollection(id: string): void {
    collections.value = collections.value.filter((collection) => collection.id !== id);
  }

  function addRecipeToCollection(collectionId: string, recipeId: string): void {
    collections.value = collections.value.map((collection) => {
      if (collection.id !== collectionId || collection.recipeIds.includes(recipeId)) {
        return collection;
      }
      return {
        ...collection,
        recipeIds: [...collection.recipeIds, recipeId]
      };
    });
  }

  function removeRecipeFromCollection(collectionId: string, recipeId: string): void {
    collections.value = collections.value.map((collection) => {
      if (collection.id !== collectionId) {
        return collection;
      }
      return {
        ...collection,
        recipeIds: collection.recipeIds.filter((id) => id !== recipeId)
      };
    });
  }

  function removeRecipeEverywhere(recipeId: string): void {
    collections.value = collections.value.map((collection) => ({
      ...collection,
      recipeIds: collection.recipeIds.filter((id) => id !== recipeId)
    }));
  }

  function isRecipeCollected(recipeId: string): boolean {
    return collections.value.some((collection) => collection.recipeIds.includes(recipeId));
  }

  function quickToggleFavorite(recipeId: string): void {
    const firstCollection = collections.value[0] ?? createCollection('我的收藏');
    if (firstCollection.recipeIds.includes(recipeId)) {
      removeRecipeFromCollection(firstCollection.id, recipeId);
      return;
    }
    addRecipeToCollection(firstCollection.id, recipeId);
  }

  return {
    collections,
    sortedCollections,
    createCollection,
    deleteCollection,
    addRecipeToCollection,
    removeRecipeFromCollection,
    removeRecipeEverywhere,
    isRecipeCollected,
    quickToggleFavorite
  };
});
