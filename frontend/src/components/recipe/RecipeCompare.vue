<template>
  <section v-if="left && right" class="grid gap-6 lg:grid-cols-2">
    <article class="compare-panel">
      <h2 class="font-display text-3xl text-[var(--color-text)]">{{ left.name }}</h2>
      <CompareField label="基酒" :value="left.baseSpirit" :highlight="left.baseSpirit !== right.baseSpirit" />
      <CompareField label="杯型" :value="formatGlassType(left.glassType)" :highlight="left.glassType !== right.glassType" />
      <CompareField label="方法" :value="formatMixMethod(left.method)" :highlight="left.method !== right.method" />
      <CompareField label="ABV" :value="formatAbv(leftAbv)" :highlight="Math.abs(leftAbv - rightAbv) > 1" />
      <IngredientTableSide :recipe="left" :other="right" :ingredients="ingredients" />
    </article>
    <article class="compare-panel">
      <h2 class="font-display text-3xl text-[var(--color-text)]">{{ right.name }}</h2>
      <CompareField label="基酒" :value="right.baseSpirit" :highlight="left.baseSpirit !== right.baseSpirit" />
      <CompareField label="杯型" :value="formatGlassType(right.glassType)" :highlight="left.glassType !== right.glassType" />
      <CompareField label="方法" :value="formatMixMethod(right.method)" :highlight="left.method !== right.method" />
      <CompareField label="ABV" :value="formatAbv(rightAbv)" :highlight="Math.abs(leftAbv - rightAbv) > 1" />
      <IngredientTableSide :recipe="right" :other="left" :ingredients="ingredients" />
    </article>
  </section>
  <EmptyState
    v-else
    title="选择两个配方开始对比"
    description="左右两侧会高亮杯型、方法、酒精度与材料比例的差异。"
  />
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue';
import EmptyState from '../common/EmptyState.vue';
import type { Ingredient } from '../../types/ingredient';
import type { CocktailRecipe, RecipeIngredient } from '../../types/recipe';
import { amountToMl, calculateRecipeAbv } from '../../utils/abvCalculator';
import { formatAbv, formatAmount, formatGlassType, formatMixMethod } from '../../utils/format';

interface RecipeCompareProps {
  left: CocktailRecipe | null;
  right: CocktailRecipe | null;
  ingredients: Ingredient[];
}

const props = defineProps<RecipeCompareProps>();

const leftAbv = computed(() => (props.left ? calculateRecipeAbv(props.left, props.ingredients) : 0));
const rightAbv = computed(() => (props.right ? calculateRecipeAbv(props.right, props.ingredients) : 0));

const CompareField = defineComponent({
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    highlight: { type: Boolean, required: true }
  },
  setup(fieldProps) {
    return () =>
      h('div', { class: ['compare-row', fieldProps.highlight ? 'compare-highlight' : ''] }, [
        h('span', fieldProps.label),
        h('strong', fieldProps.value)
      ]);
  }
});

const IngredientTableSide = defineComponent({
  props: {
    recipe: { type: Object as () => CocktailRecipe, required: true },
    other: { type: Object as () => CocktailRecipe, required: true },
    ingredients: { type: Array as () => Ingredient[], required: true }
  },
  setup(tableProps) {
    const ingredientMap = computed(() => new Map(tableProps.ingredients.map((ingredient) => [ingredient.id, ingredient])));
    const otherAmounts = computed(() => new Map(tableProps.other.ingredients.map((item) => [item.ingredientId, amountToMl(item)])));

    function isDifferent(item: RecipeIngredient): boolean {
      const otherAmount = otherAmounts.value.get(item.ingredientId);
      return otherAmount === undefined || Math.abs(otherAmount - amountToMl(item)) > 2;
    }

    return () =>
      h(
        'div',
        { class: 'mt-5 space-y-2' },
        tableProps.recipe.ingredients.map((item) => {
          const ingredient = ingredientMap.value.get(item.ingredientId);
          return h('div', { class: ['compare-row', isDifferent(item) ? 'compare-highlight' : ''] }, [
            h('span', ingredient?.name ?? '未知材料'),
            h('strong', formatAmount(item.amount, item.unit))
          ]);
        })
      );
  }
});
</script>
