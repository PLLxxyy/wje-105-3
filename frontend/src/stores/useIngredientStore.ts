import { computed } from 'vue';
import { defineStore } from 'pinia';
import { DEFAULT_INGREDIENT_ID_SET, DEFAULT_INGREDIENTS } from '../constants/defaultIngredients';
import { INGREDIENT_CATEGORY } from '../constants/enums';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';
import type { Ingredient } from '../types/ingredient';

function createId(): string {
  return crypto.randomUUID();
}

export type IngredientPayload = Omit<Ingredient, 'id'>;

export const useIngredientStore = defineStore('ingredients', () => {
  const ingredients = useLocalStorage<Ingredient[]>(STORAGE_KEYS.ingredients, DEFAULT_INGREDIENTS);

  const baseSpirits = computed(() => ingredients.value.filter((ingredient) => ingredient.category === INGREDIENT_CATEGORY.BaseSpirit));

  function getIngredientById(id: string): Ingredient | undefined {
    return ingredients.value.find((ingredient) => ingredient.id === id);
  }

  function isDefaultIngredient(id: string): boolean {
    return DEFAULT_INGREDIENT_ID_SET.has(id);
  }

  function addIngredient(payload: IngredientPayload): Ingredient {
    const ingredient: Ingredient = {
      ...payload,
      id: createId()
    };
    ingredients.value = [ingredient, ...ingredients.value];
    return ingredient;
  }

  function updateIngredient(id: string, payload: IngredientPayload): Ingredient | undefined {
    if (isDefaultIngredient(id)) {
      return undefined;
    }
    let updatedIngredient: Ingredient | undefined;
    ingredients.value = ingredients.value.map((ingredient) => {
      if (ingredient.id !== id) {
        return ingredient;
      }
      updatedIngredient = { ...payload, id };
      return updatedIngredient;
    });
    return updatedIngredient;
  }

  function deleteIngredient(id: string): boolean {
    if (isDefaultIngredient(id)) {
      return false;
    }
    ingredients.value = ingredients.value.filter((ingredient) => ingredient.id !== id);
    return true;
  }

  return {
    ingredients,
    baseSpirits,
    getIngredientById,
    isDefaultIngredient,
    addIngredient,
    updateIngredient,
    deleteIngredient
  };
});
