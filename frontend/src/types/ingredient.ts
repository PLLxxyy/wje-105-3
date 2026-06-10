import type { IngredientCategory } from './enums';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  abv: number;
  description: string;
  color: string;
}
