import type { Difficulty, GlassType, IngredientUnit, MixMethod } from './enums';

export interface RecipeIngredient {
  id: string;
  ingredientId: string;
  amount: number;
  unit: IngredientUnit;
}

export interface CocktailRecipe {
  id: string;
  name: string;
  description: string;
  baseSpirit: string;
  glassType: GlassType;
  method: MixMethod;
  garnish: string;
  difficulty: Difficulty;
  isAlcoholic: boolean;
  ingredients: RecipeIngredient[];
  steps: string[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export type RecipePayload = Omit<CocktailRecipe, 'id' | 'createdAt' | 'updatedAt'>;

export interface FilterState {
  search: string;
  baseSpirit: string;
  maxAbv: number;
  difficulties: Difficulty[];
  tags: string[];
  category: string;
}
