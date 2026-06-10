export type GlassType = 'coupe' | 'highball' | 'rocks' | 'martini' | 'hurricane' | 'copper_mug';

export type MixMethod = 'shake' | 'stir' | 'build' | 'blend' | 'layer';

export type IngredientCategory = 'base_spirit' | 'liqueur' | 'juice' | 'syrup' | 'bitters' | 'soda' | 'other';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type IngredientUnit = 'ml' | 'oz' | 'dash' | 'drop' | 'piece';

export type ThemeMode = 'light' | 'dark';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}
