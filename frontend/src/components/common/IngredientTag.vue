<template>
  <span class="inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-black/10" :style="tagStyle">
    <span class="truncate">{{ ingredient.name }}</span>
    <span v-if="amount !== undefined && unit" class="shrink-0 opacity-80">{{ formatAmount(amount, unit) }}</span>
    <button
      v-if="closable"
      type="button"
      class="grid h-5 w-5 place-items-center rounded-full bg-black/10 text-xs transition hover:bg-black/20"
      aria-label="移除材料"
      @click.stop="emit('close', ingredient.id)"
    >
      ×
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Ingredient } from '../../types/ingredient';
import type { IngredientUnit } from '../../types/enums';
import { formatAmount } from '../../utils/format';

interface IngredientTagProps {
  ingredient: Ingredient;
  amount?: number;
  unit?: IngredientUnit;
  closable?: boolean;
}

const props = withDefaults(defineProps<IngredientTagProps>(), {
  closable: false
});

const emit = defineEmits<{
  close: [id: string];
}>();

function contrastColor(hexColor: string): string {
  const normalized = hexColor.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.62 ? '#1c1712' : '#fffaf0';
}

const tagStyle = computed(() => ({
  backgroundColor: props.ingredient.color,
  color: contrastColor(props.ingredient.color)
}));
</script>
