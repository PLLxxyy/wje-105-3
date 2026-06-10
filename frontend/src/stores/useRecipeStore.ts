import { computed } from 'vue';
import { defineStore } from 'pinia';
import { DEFAULT_RECIPES } from '../mock/defaultRecipes';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';
import type { CocktailRecipe, RecipePayload } from '../types/recipe';

function createId(): string {
  return crypto.randomUUID();
}

export const useRecipeStore = defineStore('recipes', () => {
  const recipes = useLocalStorage<CocktailRecipe[]>(STORAGE_KEYS.recipes, DEFAULT_RECIPES);
  const recentRecipeIds = useLocalStorage<string[]>(STORAGE_KEYS.recentRecipes, []);

  const sortedRecipes = computed(() => [...recipes.value].sort((left, right) => right.updatedAt - left.updatedAt));
  const recentRecipes = computed(() =>
    recentRecipeIds.value
      .map((id) => recipes.value.find((recipe) => recipe.id === id))
      .filter((recipe): recipe is CocktailRecipe => Boolean(recipe))
  );

  function getRecipeById(id: string): CocktailRecipe | undefined {
    return recipes.value.find((recipe) => recipe.id === id);
  }

  function addRecipe(payload: RecipePayload): CocktailRecipe {
    const now = Date.now();
    const recipe: CocktailRecipe = {
      ...payload,
      id: createId(),
      createdAt: now,
      updatedAt: now
    };
    recipes.value = [recipe, ...recipes.value];
    return recipe;
  }

  function updateRecipe(id: string, payload: RecipePayload): CocktailRecipe | undefined {
    let updatedRecipe: CocktailRecipe | undefined;
    recipes.value = recipes.value.map((recipe) => {
      if (recipe.id !== id) {
        return recipe;
      }
      updatedRecipe = {
        ...recipe,
        ...payload,
        id,
        createdAt: recipe.createdAt,
        updatedAt: Date.now()
      };
      return updatedRecipe;
    });
    return updatedRecipe;
  }

  function deleteRecipe(id: string): void {
    recipes.value = recipes.value.filter((recipe) => recipe.id !== id);
    recentRecipeIds.value = recentRecipeIds.value.filter((recipeId) => recipeId !== id);
  }

  function markViewed(id: string): void {
    recentRecipeIds.value = [id, ...recentRecipeIds.value.filter((recipeId) => recipeId !== id)].slice(0, 6);
  }

  return {
    recipes,
    sortedRecipes,
    recentRecipes,
    getRecipeById,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    markViewed
  };
});
