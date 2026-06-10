import type {
  Difficulty,
  GlassType,
  IngredientCategory,
  IngredientUnit,
  MixMethod,
  SelectOption,
  ThemeMode
} from '../types/enums';

export const GLASS_TYPE = {
  Coupe: 'coupe',
  Highball: 'highball',
  Rocks: 'rocks',
  Martini: 'martini',
  Hurricane: 'hurricane',
  CopperMug: 'copper_mug'
} as const satisfies Record<string, GlassType>;

export const MIX_METHOD = {
  Shake: 'shake',
  Stir: 'stir',
  Build: 'build',
  Blend: 'blend',
  Layer: 'layer'
} as const satisfies Record<string, MixMethod>;

export const INGREDIENT_CATEGORY = {
  BaseSpirit: 'base_spirit',
  Liqueur: 'liqueur',
  Juice: 'juice',
  Syrup: 'syrup',
  Bitters: 'bitters',
  Soda: 'soda',
  Other: 'other'
} as const satisfies Record<string, IngredientCategory>;

export const DIFFICULTY = {
  Easy: 'easy',
  Medium: 'medium',
  Hard: 'hard'
} as const satisfies Record<string, Difficulty>;

export const INGREDIENT_UNIT = {
  Ml: 'ml',
  Oz: 'oz',
  Dash: 'dash',
  Drop: 'drop',
  Piece: 'piece'
} as const satisfies Record<string, IngredientUnit>;

export const THEME_MODE = {
  Light: 'light',
  Dark: 'dark'
} as const satisfies Record<string, ThemeMode>;

export const GLASS_TYPE_OPTIONS: SelectOption<GlassType>[] = [
  { value: GLASS_TYPE.Coupe, label: '鸡尾酒杯' },
  { value: GLASS_TYPE.Highball, label: '高球杯' },
  { value: GLASS_TYPE.Rocks, label: '岩石杯' },
  { value: GLASS_TYPE.Martini, label: '马天尼杯' },
  { value: GLASS_TYPE.Hurricane, label: '飓风杯' },
  { value: GLASS_TYPE.CopperMug, label: '铜杯' }
];

export const MIX_METHOD_OPTIONS: SelectOption<MixMethod>[] = [
  { value: MIX_METHOD.Shake, label: '摇和法' },
  { value: MIX_METHOD.Stir, label: '调和法' },
  { value: MIX_METHOD.Build, label: '兑和法' },
  { value: MIX_METHOD.Blend, label: '搅拌法' },
  { value: MIX_METHOD.Layer, label: '分层法' }
];

export const INGREDIENT_CATEGORY_OPTIONS: SelectOption<IngredientCategory>[] = [
  { value: INGREDIENT_CATEGORY.BaseSpirit, label: '基酒' },
  { value: INGREDIENT_CATEGORY.Liqueur, label: '利口酒' },
  { value: INGREDIENT_CATEGORY.Juice, label: '果汁' },
  { value: INGREDIENT_CATEGORY.Syrup, label: '糖浆' },
  { value: INGREDIENT_CATEGORY.Bitters, label: '苦精' },
  { value: INGREDIENT_CATEGORY.Soda, label: '苏打' },
  { value: INGREDIENT_CATEGORY.Other, label: '其他' }
];

export const DIFFICULTY_OPTIONS: SelectOption<Difficulty>[] = [
  { value: DIFFICULTY.Easy, label: '简单' },
  { value: DIFFICULTY.Medium, label: '中等' },
  { value: DIFFICULTY.Hard, label: '进阶' }
];

export const UNIT_OPTIONS: SelectOption<IngredientUnit>[] = [
  { value: INGREDIENT_UNIT.Ml, label: 'ml' },
  { value: INGREDIENT_UNIT.Oz, label: 'oz' },
  { value: INGREDIENT_UNIT.Dash, label: 'dash' },
  { value: INGREDIENT_UNIT.Drop, label: 'drop' },
  { value: INGREDIENT_UNIT.Piece, label: 'piece' }
];

export const STYLE_TAG_OPTIONS = ['经典', '清爽', '浓郁', '果味', '酸甜', '芳香', '气泡', '热带', '餐前', '派对'] as const;

export const GLASS_TYPE_LABELS: Record<GlassType, string> = Object.fromEntries(
  GLASS_TYPE_OPTIONS.map((option) => [option.value, option.label])
) as Record<GlassType, string>;

export const MIX_METHOD_LABELS: Record<MixMethod, string> = Object.fromEntries(
  MIX_METHOD_OPTIONS.map((option) => [option.value, option.label])
) as Record<MixMethod, string>;

export const INGREDIENT_CATEGORY_LABELS: Record<IngredientCategory, string> = Object.fromEntries(
  INGREDIENT_CATEGORY_OPTIONS.map((option) => [option.value, option.label])
) as Record<IngredientCategory, string>;

export const DIFFICULTY_LABELS: Record<Difficulty, string> = Object.fromEntries(
  DIFFICULTY_OPTIONS.map((option) => [option.value, option.label])
) as Record<Difficulty, string>;
