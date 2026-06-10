import { INGREDIENT_UNIT } from '../constants/enums';
import type { Ingredient } from '../types/ingredient';
import type { CocktailRecipe, RecipeIngredient } from '../types/recipe';

const UNIT_TO_ML: Record<RecipeIngredient['unit'], number> = {
  [INGREDIENT_UNIT.Ml]: 1,
  [INGREDIENT_UNIT.Oz]: 29.5735,
  [INGREDIENT_UNIT.Dash]: 0.92,
  [INGREDIENT_UNIT.Drop]: 0.05,
  [INGREDIENT_UNIT.Piece]: 0
};

export function amountToMl(item: RecipeIngredient): number {
  return item.amount * UNIT_TO_ML[item.unit];
}

export function calculateRecipeAbv(recipe: CocktailRecipe, ingredients: Ingredient[]): number {
  const ingredientMap = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));
  const totals = recipe.ingredients.reduce(
    (accumulator, item) => {
      const ingredient = ingredientMap.get(item.ingredientId);
      const ml = amountToMl(item);
      if (!ingredient || ml <= 0) {
        return accumulator;
      }
      return {
        volume: accumulator.volume + ml,
        alcohol: accumulator.alcohol + ml * (ingredient.abv / 100)
      };
    },
    { volume: 0, alcohol: 0 }
  );

  return totals.volume === 0 ? 0 : (totals.alcohol / totals.volume) * 100;
}
