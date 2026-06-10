<template>
  <div class="space-y-12">
    <section class="border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
      <div class="flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-[var(--color-muted)]">今日安排</p>
          <h2 class="section-title">{{ todayLabel }}</h2>
        </div>
        <button type="button" class="action-link" @click="schedulePickerVisible = true">管理排期</button>
      </div>
      <div v-if="todayScheduleRecipes.length" class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RecipeCard
          v-for="recipe in todayScheduleRecipes"
          :key="recipe.id"
          :recipe="recipe"
          :ingredients="ingredients"
          :collected="collectionStore.isRecipeCollected(recipe.id)"
          @favorite="collectionStore.quickToggleFavorite"
        />
      </div>
      <EmptyState
        v-else
        icon="程"
        title="今天还没有安排"
        description="打开配方详情或点击管理排期，把想调的配方安排到今天。"
        action-text="浏览配方"
        :action-handler="goRecipes"
      />
    </section>

    <section class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <p class="text-sm font-bold uppercase text-[var(--color-muted)]">Cocktail composition workspace</p>
        <h1 class="mt-4 max-w-4xl font-display text-6xl leading-none text-[var(--color-text)]">把经典配方、个人材料和调制动作放在同一个吧台上。</h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">浏览、创建、收藏、演示和比较鸡尾酒配方，所有数据保存在浏览器本地。</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink class="action-link bg-[var(--color-accent)] text-[var(--color-accent-text)]" to="/recipes">浏览全部</RouterLink>
          <RouterLink class="action-link" to="/recipes/new">创建配方</RouterLink>
        </div>
      </div>
      <div class="border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
        <p class="text-sm font-semibold text-[var(--color-muted)]">快速入口</p>
        <div class="mt-4 grid gap-3">
          <RouterLink v-for="entry in quickEntries" :key="entry.to" :to="entry.to" class="quick-entry">
            <span>{{ entry.icon }}</span>
            <strong>{{ entry.label }}</strong>
          </RouterLink>
          <button type="button" class="quick-entry" @click="schedulePickerVisible = true">
            <span>程</span>
            <strong>本周排期</strong>
          </button>
        </div>
      </div>
    </section>

    <section>
      <div class="mb-5 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-[var(--color-muted)]">推荐配方</p>
          <h2 class="section-title">经典起手式</h2>
        </div>
        <RouterLink to="/recipes" class="text-sm font-semibold text-[var(--color-accent)]">浏览全部</RouterLink>
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RecipeCard
          v-for="recipe in recommendedRecipes"
          :key="recipe.id"
          :recipe="recipe"
          :ingredients="ingredients"
          :collected="collectionStore.isRecipeCollected(recipe.id)"
          @favorite="collectionStore.quickToggleFavorite"
        />
      </div>
    </section>

    <section>
      <div class="mb-5">
        <p class="text-sm font-semibold text-[var(--color-muted)]">最近浏览</p>
        <h2 class="section-title">刚看过的配方</h2>
      </div>
      <div v-if="recentRecipes.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <RecipeCard
          v-for="recipe in recentRecipes"
          :key="recipe.id"
          :recipe="recipe"
          :ingredients="ingredients"
          :collected="collectionStore.isRecipeCollected(recipe.id)"
          @favorite="collectionStore.quickToggleFavorite"
        />
      </div>
      <EmptyState
        v-else
        icon="◌"
        title="还没有浏览记录"
        description="打开任意配方详情后，这里会保留最近查看的配方。"
        action-text="去浏览配方"
        :action-handler="goRecipes"
      />
    </section>
  </div>

  <SchedulePicker
    :visible="schedulePickerVisible"
    @close="schedulePickerVisible = false"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import EmptyState from '../components/common/EmptyState.vue';
import SchedulePicker from '../components/common/SchedulePicker.vue';
import RecipeCard from '../components/recipe/RecipeCard.vue';
import { useCollectionStore } from '../stores/useCollectionStore';
import { useIngredientStore } from '../stores/useIngredientStore';
import { useRecipeStore } from '../stores/useRecipeStore';
import { useScheduleStore, toDateString } from '../stores/useScheduleStore';

const router = useRouter();
const recipeStore = useRecipeStore();
const ingredientStore = useIngredientStore();
const collectionStore = useCollectionStore();
const scheduleStore = useScheduleStore();
const { sortedRecipes, recentRecipes } = storeToRefs(recipeStore);
const { ingredients } = storeToRefs(ingredientStore);

const schedulePickerVisible = ref(false);

const today = toDateString(new Date());
const todayLabel = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date());

const todayScheduleRecipes = computed(() => {
  const items = scheduleStore.getItemsByDate(today);
  return items
    .map((item) => recipeStore.getRecipeById(item.recipeId))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
});

const quickEntries = [
  { to: '/recipes/new', label: '创建配方', icon: '+' },
  { to: '/ingredients', label: '材料库', icon: '色' },
  { to: '/animation', label: '动画演示', icon: '动' },
  { to: '/collections', label: '收藏夹', icon: '藏' }
] as const;

const recommendedRecipes = computed(() => sortedRecipes.value.slice(0, 4));

function goRecipes(): void {
  void router.push('/recipes');
}
</script>
