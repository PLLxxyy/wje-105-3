import { DEFAULT_INGREDIENT_IDS } from '../constants/defaultIngredients';
import { DIFFICULTY, GLASS_TYPE, INGREDIENT_UNIT, MIX_METHOD } from '../constants/enums';
import type { CocktailRecipe } from '../types/recipe';

const seedTimestamp = 1717200000000;

export const DEFAULT_RECIPES: CocktailRecipe[] = [
  {
    id: 'a1111111-1111-4111-8111-111111111111',
    name: 'Old Fashioned（古典鸡尾酒）',
    description: '用波本、糖和苦精构成的经典短饮，结构清晰，适合慢慢品饮。',
    baseSpirit: '波本威士忌',
    glassType: GLASS_TYPE.Rocks,
    method: MIX_METHOD.Stir,
    garnish: '橙皮卷、樱桃',
    difficulty: DIFFICULTY.Easy,
    isAlcoholic: true,
    ingredients: [
      { id: 'a1111111-aaaa-4111-8111-111111111111', ingredientId: DEFAULT_INGREDIENT_IDS.bourbon, amount: 60, unit: INGREDIENT_UNIT.Ml },
      { id: 'a1111111-bbbb-4111-8111-111111111111', ingredientId: DEFAULT_INGREDIENT_IDS.simpleSyrup, amount: 10, unit: INGREDIENT_UNIT.Ml },
      { id: 'a1111111-cccc-4111-8111-111111111111', ingredientId: DEFAULT_INGREDIENT_IDS.angostura, amount: 2, unit: INGREDIENT_UNIT.Dash }
    ],
    steps: ['将苦精和糖浆倒入杯中', '加入大冰块', '倒入波本威士忌', '轻轻搅拌约30秒', '橙皮卷挤油后放入杯中'],
    tags: ['经典', '浓郁', '芳香'],
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp
  },
  {
    id: 'a2222222-2222-4222-8222-222222222222',
    name: 'Mojito（莫吉托）',
    description: '薄荷、青柠与朗姆叠加出清爽气泡感，是高球杯里的夏日配方。',
    baseSpirit: '白朗姆',
    glassType: GLASS_TYPE.Highball,
    method: MIX_METHOD.Build,
    garnish: '薄荷枝、青柠角',
    difficulty: DIFFICULTY.Easy,
    isAlcoholic: true,
    ingredients: [
      { id: 'a2222222-aaaa-4222-8222-222222222222', ingredientId: DEFAULT_INGREDIENT_IDS.whiteRum, amount: 50, unit: INGREDIENT_UNIT.Ml },
      { id: 'a2222222-bbbb-4222-8222-222222222222', ingredientId: DEFAULT_INGREDIENT_IDS.limeJuice, amount: 25, unit: INGREDIENT_UNIT.Ml },
      { id: 'a2222222-cccc-4222-8222-222222222222', ingredientId: DEFAULT_INGREDIENT_IDS.simpleSyrup, amount: 20, unit: INGREDIENT_UNIT.Ml },
      { id: 'a2222222-dddd-4222-8222-222222222222', ingredientId: DEFAULT_INGREDIENT_IDS.mint, amount: 8, unit: INGREDIENT_UNIT.Piece },
      { id: 'a2222222-eeee-4222-8222-222222222222', ingredientId: DEFAULT_INGREDIENT_IDS.sodaWater, amount: 80, unit: INGREDIENT_UNIT.Ml }
    ],
    steps: ['薄荷叶和糖浆放入杯中轻轻捣压', '加入青柠汁', '加入碎冰', '倒入白朗姆', '注入苏打水至满杯', '轻轻搅拌'],
    tags: ['清爽', '气泡', '派对'],
    createdAt: seedTimestamp + 1000,
    updatedAt: seedTimestamp + 1000
  },
  {
    id: 'a3333333-3333-4333-8333-333333333333',
    name: 'Margarita（玛格丽特）',
    description: '龙舌兰、橙味利口酒与青柠的酸甜平衡，盐边让香气更锋利。',
    baseSpirit: '龙舌兰',
    glassType: GLASS_TYPE.Coupe,
    method: MIX_METHOD.Shake,
    garnish: '盐边、青柠角',
    difficulty: DIFFICULTY.Easy,
    isAlcoholic: true,
    ingredients: [
      { id: 'a3333333-aaaa-4333-8333-333333333333', ingredientId: DEFAULT_INGREDIENT_IDS.tequila, amount: 50, unit: INGREDIENT_UNIT.Ml },
      { id: 'a3333333-bbbb-4333-8333-333333333333', ingredientId: DEFAULT_INGREDIENT_IDS.cointreau, amount: 25, unit: INGREDIENT_UNIT.Ml },
      { id: 'a3333333-cccc-4333-8333-333333333333', ingredientId: DEFAULT_INGREDIENT_IDS.limeJuice, amount: 25, unit: INGREDIENT_UNIT.Ml }
    ],
    steps: ['杯口做盐边装饰', '将龙舌兰、君度、青柠汁倒入摇酒壶', '加冰用力摇匀', '滤入鸡尾酒杯'],
    tags: ['经典', '酸甜', '派对'],
    createdAt: seedTimestamp + 2000,
    updatedAt: seedTimestamp + 2000
  },
  {
    id: 'a4444444-4444-4444-8444-444444444444',
    name: 'Martini（马天尼）',
    description: '金酒与干味美思的极简组合，温度、稀释度和杯型决定成品质感。',
    baseSpirit: '金酒',
    glassType: GLASS_TYPE.Martini,
    method: MIX_METHOD.Stir,
    garnish: '橄榄或柠檬皮',
    difficulty: DIFFICULTY.Medium,
    isAlcoholic: true,
    ingredients: [
      { id: 'a4444444-aaaa-4444-8444-444444444444', ingredientId: DEFAULT_INGREDIENT_IDS.gin, amount: 60, unit: INGREDIENT_UNIT.Ml },
      { id: 'a4444444-bbbb-4444-8444-444444444444', ingredientId: DEFAULT_INGREDIENT_IDS.dryVermouth, amount: 10, unit: INGREDIENT_UNIT.Ml }
    ],
    steps: ['将金酒和干味美思倒入调酒杯', '加冰搅拌约30秒', '滤入冰过的马天尼杯', '用橄榄或柠檬皮装饰'],
    tags: ['经典', '浓郁', '餐前'],
    createdAt: seedTimestamp + 3000,
    updatedAt: seedTimestamp + 3000
  },
  {
    id: 'a5555555-5555-4555-8555-555555555555',
    name: 'Daiquiri（大吉利）',
    description: '朗姆、青柠和糖浆的三段式平衡，干净直接，适合检验酸甜比例。',
    baseSpirit: '白朗姆',
    glassType: GLASS_TYPE.Coupe,
    method: MIX_METHOD.Shake,
    garnish: '青柠角',
    difficulty: DIFFICULTY.Easy,
    isAlcoholic: true,
    ingredients: [
      { id: 'a5555555-aaaa-4555-8555-555555555555', ingredientId: DEFAULT_INGREDIENT_IDS.whiteRum, amount: 50, unit: INGREDIENT_UNIT.Ml },
      { id: 'a5555555-bbbb-4555-8555-555555555555', ingredientId: DEFAULT_INGREDIENT_IDS.limeJuice, amount: 25, unit: INGREDIENT_UNIT.Ml },
      { id: 'a5555555-cccc-4555-8555-555555555555', ingredientId: DEFAULT_INGREDIENT_IDS.simpleSyrup, amount: 15, unit: INGREDIENT_UNIT.Ml }
    ],
    steps: ['将白朗姆、青柠汁、糖浆倒入摇酒壶', '加冰用力摇匀约15秒', '滤入鸡尾酒杯'],
    tags: ['经典', '清爽', '酸甜'],
    createdAt: seedTimestamp + 4000,
    updatedAt: seedTimestamp + 4000
  },
  {
    id: 'a6666666-6666-4666-8666-666666666666',
    name: 'Cosmopolitan（大都会）',
    description: '伏特加、君度和蔓越莓带来明亮红色与利落酸度，适合派对场景。',
    baseSpirit: '伏特加',
    glassType: GLASS_TYPE.Martini,
    method: MIX_METHOD.Shake,
    garnish: '橙皮',
    difficulty: DIFFICULTY.Medium,
    isAlcoholic: true,
    ingredients: [
      { id: 'a6666666-aaaa-4666-8666-666666666666', ingredientId: DEFAULT_INGREDIENT_IDS.vodka, amount: 40, unit: INGREDIENT_UNIT.Ml },
      { id: 'a6666666-bbbb-4666-8666-666666666666', ingredientId: DEFAULT_INGREDIENT_IDS.cointreau, amount: 15, unit: INGREDIENT_UNIT.Ml },
      { id: 'a6666666-cccc-4666-8666-666666666666', ingredientId: DEFAULT_INGREDIENT_IDS.cranberryJuice, amount: 30, unit: INGREDIENT_UNIT.Ml },
      { id: 'a6666666-dddd-4666-8666-666666666666', ingredientId: DEFAULT_INGREDIENT_IDS.limeJuice, amount: 15, unit: INGREDIENT_UNIT.Ml }
    ],
    steps: ['将所有材料倒入摇酒壶', '加冰用力摇匀', '滤入马天尼杯', '橙皮挤油装饰'],
    tags: ['果味', '酸甜', '派对'],
    createdAt: seedTimestamp + 5000,
    updatedAt: seedTimestamp + 5000
  },
  {
    id: 'a7777777-7777-4777-8777-777777777777',
    name: 'Hurricane（飓风）',
    description: '白朗姆、橙汁和红石榴糖浆混合出热带层次，杯型本身就是视觉记忆点。',
    baseSpirit: '白朗姆',
    glassType: GLASS_TYPE.Hurricane,
    method: MIX_METHOD.Blend,
    garnish: '橙片、樱桃',
    difficulty: DIFFICULTY.Medium,
    isAlcoholic: true,
    ingredients: [
      { id: 'a7777777-aaaa-4777-8777-777777777777', ingredientId: DEFAULT_INGREDIENT_IDS.whiteRum, amount: 30, unit: INGREDIENT_UNIT.Ml },
      { id: 'a7777777-bbbb-4777-8777-777777777777', ingredientId: DEFAULT_INGREDIENT_IDS.orangeJuice, amount: 60, unit: INGREDIENT_UNIT.Ml },
      { id: 'a7777777-cccc-4777-8777-777777777777', ingredientId: DEFAULT_INGREDIENT_IDS.limeJuice, amount: 15, unit: INGREDIENT_UNIT.Ml },
      { id: 'a7777777-dddd-4777-8777-777777777777', ingredientId: DEFAULT_INGREDIENT_IDS.grenadine, amount: 15, unit: INGREDIENT_UNIT.Ml },
      { id: 'a7777777-eeee-4777-8777-777777777777', ingredientId: DEFAULT_INGREDIENT_IDS.simpleSyrup, amount: 10, unit: INGREDIENT_UNIT.Ml }
    ],
    steps: ['将所有材料与碎冰放入搅拌机', '高速搅拌至顺滑', '倒入飓风杯', '用橙片和樱桃装饰'],
    tags: ['热带', '果味', '派对'],
    createdAt: seedTimestamp + 6000,
    updatedAt: seedTimestamp + 6000
  },
  {
    id: 'a8888888-8888-4888-8888-888888888888',
    name: 'Sidecar（边车）',
    description: '白兰地、君度和柠檬汁的经典酸酒结构，糖边带来柔和收口。',
    baseSpirit: '白兰地',
    glassType: GLASS_TYPE.Coupe,
    method: MIX_METHOD.Shake,
    garnish: '糖边、柠檬皮',
    difficulty: DIFFICULTY.Medium,
    isAlcoholic: true,
    ingredients: [
      { id: 'a8888888-aaaa-4888-8888-888888888888', ingredientId: DEFAULT_INGREDIENT_IDS.brandy, amount: 50, unit: INGREDIENT_UNIT.Ml },
      { id: 'a8888888-bbbb-4888-8888-888888888888', ingredientId: DEFAULT_INGREDIENT_IDS.cointreau, amount: 25, unit: INGREDIENT_UNIT.Ml },
      { id: 'a8888888-cccc-4888-8888-888888888888', ingredientId: DEFAULT_INGREDIENT_IDS.lemonJuice, amount: 25, unit: INGREDIENT_UNIT.Ml }
    ],
    steps: ['杯口做糖边装饰', '将白兰地、君度、柠檬汁倒入摇酒壶', '加冰用力摇匀', '滤入鸡尾酒杯'],
    tags: ['经典', '酸甜', '餐前'],
    createdAt: seedTimestamp + 7000,
    updatedAt: seedTimestamp + 7000
  }
];
