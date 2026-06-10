import { onUnmounted, ref, type Ref } from 'vue';
import type { Ingredient } from '../types/ingredient';
import type { CocktailRecipe } from '../types/recipe';

export function useAnimation(
  recipe: CocktailRecipe,
  ingredients: Ingredient[]
): {
  play: () => void;
  pause: () => void;
  reset: () => void;
  progress: Ref<number>;
  currentStep: Ref<number>;
  isPlaying: Ref<boolean>;
} {
  const progress = ref(0);
  const currentStep = ref(0);
  const isPlaying = ref(false);
  const knownIngredients = new Set(ingredients.map((ingredient) => ingredient.id));
  const layerCount = Math.max(1, recipe.ingredients.filter((item) => knownIngredients.has(item.ingredientId)).length);
  const duration = Math.max(4200, layerCount * 1500 + recipe.steps.length * 360);
  let animationFrame: number | undefined;
  let startedAt = 0;

  const tick = (): void => {
    const elapsed = Date.now() - startedAt;
    progress.value = Math.min(100, (elapsed / duration) * 100);
    currentStep.value = Math.min(recipe.steps.length - 1, Math.floor((progress.value / 100) * recipe.steps.length));

    if (progress.value >= 100) {
      isPlaying.value = false;
      animationFrame = undefined;
      return;
    }

    animationFrame = window.requestAnimationFrame(tick);
  };

  const pause = (): void => {
    if (animationFrame !== undefined) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = undefined;
    }
    isPlaying.value = false;
  };

  const play = (): void => {
    if (isPlaying.value) {
      return;
    }
    if (progress.value >= 100) {
      progress.value = 0;
      currentStep.value = 0;
    }
    startedAt = Date.now() - (progress.value / 100) * duration;
    isPlaying.value = true;
    animationFrame = window.requestAnimationFrame(tick);
  };

  const reset = (): void => {
    pause();
    progress.value = 0;
    currentStep.value = 0;
  };

  onUnmounted(() => {
    pause();
  });

  return { play, pause, reset, progress, currentStep, isPlaying };
}
