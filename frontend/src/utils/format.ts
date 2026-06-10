import { DIFFICULTY_LABELS, GLASS_TYPE_LABELS, MIX_METHOD_LABELS } from '../constants/enums';
import type { Difficulty, GlassType, IngredientUnit, MixMethod } from '../types/enums';

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp));
}

export function formatAmount(amount: number, unit: IngredientUnit): string {
  const value = Number.isInteger(amount) ? amount.toString() : amount.toFixed(1);
  return `${value}${unit}`;
}

export function formatAbv(abv: number): string {
  return `${abv.toFixed(1)}% ABV`;
}

export function formatGlassType(type: GlassType): string {
  return GLASS_TYPE_LABELS[type];
}

export function formatMixMethod(method: MixMethod): string {
  return MIX_METHOD_LABELS[method];
}

export function formatDifficulty(difficulty: Difficulty): string {
  return DIFFICULTY_LABELS[difficulty];
}
