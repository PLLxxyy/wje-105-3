import { INGREDIENT_CATEGORY } from './enums';
import type { Ingredient } from '../types/ingredient';

export const DEFAULT_INGREDIENT_IDS = {
  bourbon: '11111111-1111-4111-8111-111111111111',
  whiteRum: '22222222-2222-4222-8222-222222222222',
  gin: '33333333-3333-4333-8333-333333333333',
  vodka: '44444444-4444-4444-8444-444444444444',
  tequila: '55555555-5555-4555-8555-555555555555',
  brandy: '66666666-6666-4666-8666-666666666666',
  dryVermouth: '77777777-7777-4777-8777-777777777777',
  sweetVermouth: '88888888-8888-4888-8888-888888888888',
  cointreau: '99999999-9999-4999-8999-999999999999',
  limeJuice: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  lemonJuice: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  cranberryJuice: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  orangeJuice: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  simpleSyrup: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  grenadine: 'ffffffff-ffff-4fff-8fff-ffffffffffff',
  angostura: '12121212-1212-4121-8121-121212121212',
  sodaWater: '13131313-1313-4131-8131-131313131313',
  tonicWater: '14141414-1414-4141-8141-141414141414',
  mint: '15151515-1515-4151-8151-151515151515',
  ice: '16161616-1616-4161-8161-161616161616'
} as const;

export const DEFAULT_INGREDIENTS: Ingredient[] = [
  {
    id: DEFAULT_INGREDIENT_IDS.bourbon,
    name: '波本威士忌',
    category: INGREDIENT_CATEGORY.BaseSpirit,
    abv: 40,
    color: '#C2772E',
    description: '美国经典威士忌，焦糖和香草风味'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.whiteRum,
    name: '白朗姆',
    category: INGREDIENT_CATEGORY.BaseSpirit,
    abv: 40,
    color: '#F5F5DC',
    description: '清爽的加勒比朗姆酒'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.gin,
    name: '金酒',
    category: INGREDIENT_CATEGORY.BaseSpirit,
    abv: 40,
    color: '#E8E8D0',
    description: '杜松子风味烈酒'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.vodka,
    name: '伏特加',
    category: INGREDIENT_CATEGORY.BaseSpirit,
    abv: 40,
    color: '#F0F0F0',
    description: '纯净中性烈酒'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.tequila,
    name: '龙舌兰',
    category: INGREDIENT_CATEGORY.BaseSpirit,
    abv: 40,
    color: '#D4A574',
    description: '墨西哥经典烈酒'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.brandy,
    name: '白兰地',
    category: INGREDIENT_CATEGORY.BaseSpirit,
    abv: 40,
    color: '#8B4513',
    description: '法国经典葡萄烈酒'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.dryVermouth,
    name: '干味美思',
    category: INGREDIENT_CATEGORY.Liqueur,
    abv: 18,
    color: '#C5B358',
    description: '干型加香葡萄酒'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.sweetVermouth,
    name: '甜味美思',
    category: INGREDIENT_CATEGORY.Liqueur,
    abv: 16,
    color: '#8B0000',
    description: '甜型加香葡萄酒'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.cointreau,
    name: '君度',
    category: INGREDIENT_CATEGORY.Liqueur,
    abv: 40,
    color: '#FFA500',
    description: '橙味利口酒'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.limeJuice,
    name: '青柠汁',
    category: INGREDIENT_CATEGORY.Juice,
    abv: 0,
    color: '#90EE90',
    description: '新鲜青柠汁'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.lemonJuice,
    name: '柠檬汁',
    category: INGREDIENT_CATEGORY.Juice,
    abv: 0,
    color: '#FFF44F',
    description: '新鲜柠檬汁'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.cranberryJuice,
    name: '蔓越莓汁',
    category: INGREDIENT_CATEGORY.Juice,
    abv: 0,
    color: '#DC143C',
    description: '酸甜蔓越莓汁'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.orangeJuice,
    name: '橙汁',
    category: INGREDIENT_CATEGORY.Juice,
    abv: 0,
    color: '#FFA500',
    description: '鲜榨橙汁'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.simpleSyrup,
    name: '简易糖浆',
    category: INGREDIENT_CATEGORY.Syrup,
    abv: 0,
    color: '#FFFFF0',
    description: '1:1 白糖与水'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.grenadine,
    name: '红石榴糖浆',
    category: INGREDIENT_CATEGORY.Syrup,
    abv: 0,
    color: '#8B0000',
    description: '石榴风味红色糖浆'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.angostura,
    name: '安格斯特拉苦精',
    category: INGREDIENT_CATEGORY.Bitters,
    abv: 44,
    color: '#8B0000',
    description: '经典芳香苦精'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.sodaWater,
    name: '苏打水',
    category: INGREDIENT_CATEGORY.Soda,
    abv: 0,
    color: '#F0FFFF',
    description: '碳酸水'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.tonicWater,
    name: '汤力水',
    category: INGREDIENT_CATEGORY.Soda,
    abv: 0,
    color: '#F0FFFF',
    description: '奎宁风味碳酸水'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.mint,
    name: '薄荷叶',
    category: INGREDIENT_CATEGORY.Other,
    abv: 0,
    color: '#228B22',
    description: '新鲜薄荷叶'
  },
  {
    id: DEFAULT_INGREDIENT_IDS.ice,
    name: '冰块',
    category: INGREDIENT_CATEGORY.Other,
    abv: 0,
    color: '#B0E0E6',
    description: '调制用冰块'
  }
];

export const DEFAULT_INGREDIENT_ID_SET = new Set<string>(Object.values(DEFAULT_INGREDIENT_IDS));
