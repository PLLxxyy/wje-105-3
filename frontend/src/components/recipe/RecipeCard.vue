<template>
  <article class="group flex h-full flex-col border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition hover:-translate-y-1 hover:shadow-vessel">
    <div class="flex items-start justify-between gap-4">
      <RouterLink :to="`/recipes/${recipe.id}`" class="min-w-0">
        <p class="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">{{ recipe.baseSpirit }}</p>
        <h2 class="mt-2 font-display text-2xl leading-tight text-[var(--color-text)]">{{ recipe.name }}</h2>
      </RouterLink>
      <GlassIcon :type="recipe.glassType" :size="46" class="shrink-0 text-[var(--color-accent)]" />
    </div>

    <p class="mt-4 line-clamp-3 text-sm leading-6 text-[var(--color-muted)]">{{ recipe.description }}</p>

    <div class="mt-5 flex flex-wrap gap-2">
      <IngredientTag
        v-for="item in visibleIngredientRows"
        :key="item.recipeIngredient.id"
        :ingredient="item.ingredient"
        :amount="item.recipeIngredient.amount"
        :unit="item.recipeIngredient.unit"
      />
    </div>

    <div class="mt-auto flex items-center justify-between pt-6">
      <div class="text-sm text-[var(--color-muted)]">
        <span class="font-semibold text-[var(--color-text)]">{{ formatAbv(recipeAbv) }}</span>
        <span class="mx-2">·</span>
        <span>{{ difficultyLabel }}</span>
      </div>
      <button
        type="button"
        class="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm font-semibold transition hover:border-[var(--color-accent)]"
        :aria-label="collected ? '取消收藏' : '收藏配方'"
        @click.prevent.stop="emit('favorite', recipe.id)"
      >
        {{ collected ? '已藏' : '收藏' }}
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import GlassIcon from '../common/GlassIcon.vue';
import IngredientTag from '../common/IngredientTag.vue';
import { DIFFICULTY_LABELS } from '../../constants/enums';
import type { Ingredient } from '../../types/ingredient';
import type { CocktailRecipe, RecipeIngredient } from '../../types/recipe';
import { calculateRecipeAbv } from '../../utils/abvCalculator';
import { formatAbv } from '../../utils/format';

interface RecipeCardProps {
  recipe: CocktailRecipe;
  ingredients: Ingredient[];
  collected?: boolean;
}

const props = withDefaults(defineProps<RecipeCardProps>(), {
  collected: false
});

const emit = defineEmits<{
  favorite: [recipeId: string];
}>();

interface IngredientRow {
  recipeIngredient: RecipeIngredient;
  ingredient: Ingredient;
}

const visibleIngredientRows = computed<IngredientRow[]>(() => {
  const ingredientMap = new Map(props.ingredients.map((ingredient) => [ingredient.id, ingredient]));
  return props.recipe.ingredients
    .map((recipeIngredient) => {
      const ingredient = ingredientMap.get(recipeIngredient.ingredientId);
      return ingredient ? { recipeIngredient, ingredient } : undefined;
    })
    .filter((row): row is IngredientRow => Boolean(row))
    .slice(0, 3);
});

const recipeAbv = computed(() => calculateRecipeAbv(props.recipe, props.ingredients));
const difficultyLabel = computed(() => DIFFICULTY_LABELS[props.recipe.difficulty]);
</script>
