<template>
  <section class="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
    <div class="relative border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
      <div
        v-if="isPlaying"
        class="pour-stream"
        :style="{ backgroundColor: activeColor }"
      ></div>
      <LayerVisualizer :visible-layers="visibleLayers" />
    </div>

    <div class="flex flex-col justify-center">
      <p class="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-muted)]">{{ methodLabel }}</p>
      <h2 class="mt-3 font-display text-4xl text-[var(--color-text)]">{{ recipe.name }}</h2>
      <p class="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">{{ methodNarration }}</p>

      <div class="mt-8 h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
        <div class="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-300" :style="{ width: `${progress}%` }"></div>
      </div>
      <p class="mt-3 text-sm font-semibold text-[var(--color-muted)]">{{ Math.round(progress) }}%</p>

      <div class="mt-8 border-l-2 border-[var(--color-accent)] pl-5">
        <p class="text-sm font-semibold text-[var(--color-muted)]">当前步骤</p>
        <p class="mt-2 text-xl font-semibold leading-8 text-[var(--color-text)]">{{ currentStepText }}</p>
      </div>

      <div class="mt-8 flex flex-wrap gap-3">
        <button type="button" class="action-link bg-[var(--color-accent)] text-[var(--color-accent-text)]" @click="play">播放</button>
        <button type="button" class="action-link" @click="pause">暂停</button>
        <button type="button" class="action-link" @click="reset">重播</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LayerVisualizer, { type VisualLayer } from './LayerVisualizer.vue';
import { MIX_METHOD, MIX_METHOD_LABELS } from '../../constants/enums';
import { useAnimation } from '../../hooks/useAnimation';
import type { Ingredient } from '../../types/ingredient';
import type { CocktailRecipe } from '../../types/recipe';
import { amountToMl } from '../../utils/abvCalculator';

interface PourAnimationProps {
  recipe: CocktailRecipe;
  ingredients: Ingredient[];
}

const props = defineProps<PourAnimationProps>();

const { play, pause, reset, progress, currentStep, isPlaying } = useAnimation(props.recipe, props.ingredients);

const ingredientMap = computed(() => new Map(props.ingredients.map((ingredient) => [ingredient.id, ingredient])));

const visualVolumes = computed(() =>
  props.recipe.ingredients.map((item) => {
    const volume = amountToMl(item);
    return volume > 0 ? volume : Math.max(3, item.amount * 1.5);
  })
);

const totalVolume = computed(() => visualVolumes.value.reduce((total, volume) => total + volume, 0) || 1);

const visibleLayers = computed<VisualLayer[]>(() => {
  const layerCursor = (progress.value / 100) * props.recipe.ingredients.length;
  return props.recipe.ingredients.map((item, index) => {
    const ingredient = ingredientMap.value.get(item.ingredientId);
    const baseHeight = (visualVolumes.value[index] / totalVolume.value) * 88;
    const fillRatio = Math.max(0, Math.min(1, layerCursor - index));
    return {
      id: item.id,
      name: ingredient?.name ?? '未知材料',
      color: ingredient?.color ?? '#d8c6a3',
      visibleHeight: baseHeight * fillRatio
    };
  });
});

const activeColor = computed(() => {
  const activeIndex = Math.min(props.recipe.ingredients.length - 1, Math.floor((progress.value / 100) * props.recipe.ingredients.length));
  const ingredientId = props.recipe.ingredients[activeIndex]?.ingredientId;
  return ingredientMap.value.get(ingredientId)?.color ?? '#d8c6a3';
});

const currentStepText = computed(() => props.recipe.steps[currentStep.value] ?? '成品已完成');
const methodLabel = computed(() => MIX_METHOD_LABELS[props.recipe.method]);

const methodNarration = computed(() => {
  if (props.recipe.method === MIX_METHOD.Shake) {
    return '摇和法会先快速融合酸、甜与基酒，动画以连续倒入与液面震荡表现稀释过程。';
  }
  if (props.recipe.method === MIX_METHOD.Stir) {
    return '调和法强调清澈质感，分层倒入后以轻微晃动模拟冰块带来的稀释。';
  }
  if (props.recipe.method === MIX_METHOD.Blend) {
    return '搅拌法会把果汁、糖浆和碎冰融合为更厚的液面，色层会更柔和。';
  }
  if (props.recipe.method === MIX_METHOD.Layer) {
    return '分层法按材料密度逐层铺陈，颜色边界会保留更久。';
  }
  return '兑和法直接在杯中构建，气泡和液面轻晃是主要视觉线索。';
});
</script>
