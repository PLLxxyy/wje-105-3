<template>
  <form class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]" @submit.prevent="submit">
    <section class="space-y-6">
      <div class="form-section">
        <h2 class="section-title">配方档案</h2>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <label class="form-label md:col-span-2">
            名称
            <input v-model.trim="form.name" class="field" :class="{ 'field-error': errors.name }" type="text" />
            <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
          </label>
          <label class="form-label md:col-span-2">
            描述
            <textarea v-model.trim="form.description" class="field min-h-28 resize-y"></textarea>
          </label>
          <label class="form-label">
            基酒
            <select v-model="form.baseSpirit" class="field">
              <option v-for="ingredient in baseSpiritOptions" :key="ingredient.id" :value="ingredient.name">{{ ingredient.name }}</option>
            </select>
          </label>
          <label class="form-label">
            杯型
            <select v-model="form.glassType" class="field" :class="{ 'field-error': errors.glassType }">
              <option v-for="glass in GLASS_TYPE_OPTIONS" :key="glass.value" :value="glass.value">{{ glass.label }}</option>
            </select>
          </label>
          <label class="form-label">
            方法
            <select v-model="form.method" class="field" :class="{ 'field-error': errors.method }">
              <option v-for="method in MIX_METHOD_OPTIONS" :key="method.value" :value="method.value">{{ method.label }}</option>
            </select>
          </label>
          <label class="form-label">
            难度
            <select v-model="form.difficulty" class="field">
              <option v-for="difficulty in DIFFICULTY_OPTIONS" :key="difficulty.value" :value="difficulty.value">{{ difficulty.label }}</option>
            </select>
          </label>
          <label class="form-label md:col-span-2">
            装饰物
            <input v-model.trim="form.garnish" class="field" type="text" />
          </label>
        </div>
      </div>

      <div class="form-section">
        <div class="flex items-center justify-between gap-4">
          <h2 class="section-title">材料结构</h2>
          <button type="button" class="mini-button" @click="addIngredientRow">添加材料</button>
        </div>
        <span v-if="errors.ingredients" class="error-text">{{ errors.ingredients }}</span>
        <div class="mt-5 space-y-3">
          <div v-for="(item, index) in form.ingredients" :key="item.id" class="grid gap-3 border border-[var(--color-border)] p-3 md:grid-cols-[1fr_120px_120px_auto]">
            <select v-model="item.ingredientId" class="field">
              <option v-for="ingredient in ingredients" :key="ingredient.id" :value="ingredient.id">{{ ingredient.name }}</option>
            </select>
            <input v-model.number="item.amount" min="0" step="0.1" class="field" type="number" />
            <select v-model="item.unit" class="field">
              <option v-for="unit in UNIT_OPTIONS" :key="unit.value" :value="unit.value">{{ unit.label }}</option>
            </select>
            <button type="button" class="mini-button" @click="removeIngredientRow(index)">移除</button>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="flex items-center justify-between gap-4">
          <h2 class="section-title">调制步骤</h2>
          <button type="button" class="mini-button" @click="addStep">添加步骤</button>
        </div>
        <span v-if="errors.steps" class="error-text">{{ errors.steps }}</span>
        <div class="mt-5 space-y-3">
          <label v-for="(step, index) in form.steps" :key="`${index}-${step}`" class="grid gap-3 md:grid-cols-[48px_1fr_auto]">
            <span class="pt-3 font-display text-2xl text-[var(--color-accent)]">{{ index + 1 }}</span>
            <input v-model.trim="form.steps[index]" class="field" type="text" />
            <button type="button" class="mini-button" @click="removeStep(index)">移除</button>
          </label>
        </div>
      </div>

      <div class="form-section">
        <h2 class="section-title">风格标签</h2>
        <div class="mt-5 flex flex-wrap gap-2">
          <button
            v-for="tag in STYLE_TAG_OPTIONS"
            :key="tag"
            type="button"
            class="chip"
            :class="{ 'chip-active': form.tags.includes(tag) }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
        <label class="form-label mt-4">
          自定义标签
          <div class="flex gap-2">
            <input v-model.trim="customTag" class="field" type="text" @keydown.enter.prevent="addCustomTag" />
            <button type="button" class="mini-button" @click="addCustomTag">加入</button>
          </div>
        </label>
      </div>
    </section>

    <aside class="h-fit border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
      <p class="text-sm font-semibold text-[var(--color-muted)]">{{ mode === 'create' ? '新建模式' : '编辑模式' }}</p>
      <h2 class="mt-2 font-display text-3xl text-[var(--color-text)]">{{ form.name || '未命名配方' }}</h2>
      <p class="mt-4 text-sm leading-6 text-[var(--color-muted)]">{{ form.description || '保存前可继续完善描述。' }}</p>
      <div class="mt-5 flex items-center gap-4">
        <GlassIcon :type="form.glassType" :size="74" class="text-[var(--color-accent)]" />
        <div>
          <p class="text-sm text-[var(--color-muted)]">估算酒精度</p>
          <p class="text-2xl font-bold text-[var(--color-text)]">{{ formatAbv(estimatedAbv) }}</p>
        </div>
      </div>
      <div class="mt-6 flex flex-wrap gap-2">
        <IngredientTag
          v-for="row in selectedIngredientRows"
          :key="row.recipeIngredient.id"
          :ingredient="row.ingredient"
          :amount="row.recipeIngredient.amount"
          :unit="row.recipeIngredient.unit"
        />
      </div>
      <div class="mt-8 grid gap-3">
        <button type="submit" class="action-link bg-[var(--color-accent)] text-[var(--color-accent-text)]">保存配方</button>
        <button type="button" class="action-link" @click="emit('cancel')">取消</button>
      </div>
    </aside>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import GlassIcon from '../common/GlassIcon.vue';
import IngredientTag from '../common/IngredientTag.vue';
import {
  DIFFICULTY,
  DIFFICULTY_OPTIONS,
  GLASS_TYPE,
  GLASS_TYPE_OPTIONS,
  INGREDIENT_CATEGORY,
  INGREDIENT_UNIT,
  MIX_METHOD,
  MIX_METHOD_OPTIONS,
  STYLE_TAG_OPTIONS,
  UNIT_OPTIONS
} from '../../constants/enums';
import type { Ingredient } from '../../types/ingredient';
import type { CocktailRecipe, RecipeIngredient, RecipePayload } from '../../types/recipe';
import type { Difficulty, GlassType, MixMethod } from '../../types/enums';
import { calculateRecipeAbv } from '../../utils/abvCalculator';
import { formatAbv } from '../../utils/format';

interface RecipeFormProps {
  ingredients: Ingredient[];
  initialRecipe?: CocktailRecipe | null;
  mode: 'create' | 'edit';
}

const props = withDefaults(defineProps<RecipeFormProps>(), {
  initialRecipe: null
});

const emit = defineEmits<{
  save: [payload: RecipePayload];
  cancel: [];
}>();

type FormErrors = Partial<Record<'name' | 'glassType' | 'method' | 'ingredients' | 'steps', string>>;

interface IngredientRow {
  recipeIngredient: RecipeIngredient;
  ingredient: Ingredient;
}

const customTag = ref('');
const errors = reactive<FormErrors>({});

const baseSpiritOptions = computed(() => props.ingredients.filter((ingredient) => ingredient.category === INGREDIENT_CATEGORY.BaseSpirit));

const form = reactive<RecipePayload>(buildDefaultPayload());

function createId(): string {
  return crypto.randomUUID();
}

function firstIngredientId(): string {
  return props.ingredients[0]?.id ?? '';
}

function firstBaseSpiritName(): string {
  return baseSpiritOptions.value[0]?.name ?? props.ingredients[0]?.name ?? '';
}

function buildDefaultPayload(): RecipePayload {
  return {
    name: '',
    description: '',
    baseSpirit: firstBaseSpiritName(),
    glassType: GLASS_TYPE.Coupe as GlassType,
    method: MIX_METHOD.Shake as MixMethod,
    garnish: '',
    difficulty: DIFFICULTY.Easy as Difficulty,
    isAlcoholic: true,
    ingredients: [{ id: createId(), ingredientId: firstIngredientId(), amount: 30, unit: INGREDIENT_UNIT.Ml }],
    steps: ['准备杯具和冰块'],
    tags: ['经典']
  };
}

function loadRecipe(recipe: CocktailRecipe | null): void {
  const payload: RecipePayload = recipe
    ? {
        name: recipe.name,
        description: recipe.description,
        baseSpirit: recipe.baseSpirit,
        glassType: recipe.glassType,
        method: recipe.method,
        garnish: recipe.garnish,
        difficulty: recipe.difficulty,
        isAlcoholic: recipe.isAlcoholic,
        ingredients: recipe.ingredients.map((item) => ({ ...item })),
        steps: [...recipe.steps],
        tags: [...recipe.tags]
      }
    : buildDefaultPayload();

  Object.assign(form, payload);
}

watch(
  () => props.initialRecipe,
  (recipe) => {
    loadRecipe(recipe);
  },
  { immediate: true }
);

const selectedIngredientRows = computed<IngredientRow[]>(() => {
  const ingredientMap = new Map(props.ingredients.map((ingredient) => [ingredient.id, ingredient]));
  return form.ingredients
    .map((recipeIngredient) => {
      const ingredient = ingredientMap.get(recipeIngredient.ingredientId);
      return ingredient ? { recipeIngredient, ingredient } : undefined;
    })
    .filter((row): row is IngredientRow => Boolean(row));
});

const previewRecipe = computed<CocktailRecipe>(() => ({
  ...form,
  id: props.initialRecipe?.id ?? 'preview',
  createdAt: props.initialRecipe?.createdAt ?? Date.now(),
  updatedAt: Date.now()
}));

const estimatedAbv = computed(() => calculateRecipeAbv(previewRecipe.value, props.ingredients));

function clearErrors(): void {
  for (const key of Object.keys(errors) as Array<keyof FormErrors>) {
    delete errors[key];
  }
}

function addIngredientRow(): void {
  const ingredientId = firstIngredientId();
  if (!ingredientId) {
    errors.ingredients = '请先在材料库中添加可用材料。';
    return;
  }
  form.ingredients.push({ id: createId(), ingredientId, amount: 15, unit: INGREDIENT_UNIT.Ml });
}

function removeIngredientRow(index: number): void {
  form.ingredients.splice(index, 1);
}

function addStep(): void {
  form.steps.push('');
}

function removeStep(index: number): void {
  form.steps.splice(index, 1);
}

function toggleTag(tag: string): void {
  form.tags = form.tags.includes(tag) ? form.tags.filter((item) => item !== tag) : [...form.tags, tag];
}

function addCustomTag(): void {
  if (!customTag.value || form.tags.includes(customTag.value)) {
    return;
  }
  form.tags = [...form.tags, customTag.value];
  customTag.value = '';
}

function validate(): boolean {
  clearErrors();
  if (!form.name.trim()) {
    errors.name = '请填写配方名称。';
  }
  if (!form.glassType) {
    errors.glassType = '请选择杯型。';
  }
  if (!form.method) {
    errors.method = '请选择调制方法。';
  }
  const validIngredients = form.ingredients.filter((item) => item.ingredientId && item.amount > 0);
  if (validIngredients.length === 0) {
    errors.ingredients = '至少添加一种有效材料。';
  }
  const validSteps = form.steps.map((step) => step.trim()).filter(Boolean);
  if (validSteps.length === 0) {
    errors.steps = '至少保留一个调制步骤。';
  }
  return Object.keys(errors).length === 0;
}

function submit(): void {
  if (!validate()) {
    return;
  }
  const validIngredients = form.ingredients.filter((item) => item.ingredientId && item.amount > 0).map((item) => ({ ...item }));
  const validSteps = form.steps.map((step) => step.trim()).filter(Boolean);
  const ingredientMap = new Map(props.ingredients.map((ingredient) => [ingredient.id, ingredient]));
  const isAlcoholic = validIngredients.some((item) => (ingredientMap.get(item.ingredientId)?.abv ?? 0) > 0);

  emit('save', {
    ...form,
    name: form.name.trim(),
    description: form.description.trim(),
    garnish: form.garnish.trim(),
    ingredients: validIngredients,
    steps: validSteps,
    tags: form.tags.length > 0 ? [...form.tags] : ['自定义'],
    isAlcoholic
  });
}
</script>
