<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="close">
      <div class="w-full max-w-md border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-[var(--color-muted)]">{{ recipeId ? '安排排期' : '本周排期' }}</p>
            <h3 class="section-title">{{ recipeId ? recipeName : '一周安排' }}</h3>
          </div>
          <button type="button" class="text-2xl leading-none text-[var(--color-muted)]" @click="close">&times;</button>
        </div>

        <p v-if="recipeId" class="mt-4 text-sm text-[var(--color-muted)]">选择日期将配方安排到指定日程，同一日期可安排多杯。</p>

        <div class="mt-5 grid gap-2">
          <div v-for="day in weekDays" :key="day.date">
            <button
              v-if="recipeId"
              type="button"
              class="flex w-full items-center justify-between border px-4 py-3 text-left transition"
              :class="day.scheduled ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-text)]' : 'border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)] hover:border-[var(--color-accent)]'"
              @click="toggle(day.date)"
            >
              <span>
                <span class="font-semibold">{{ day.label }}</span>
                <span class="ml-2 text-sm opacity-80">{{ day.date }}</span>
              </span>
              <span class="text-sm font-bold">{{ day.scheduled ? '已安排' : '安排' }}</span>
            </button>

            <div v-else class="border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-3">
              <div class="flex items-center justify-between">
                <span>
                  <span class="font-semibold text-[var(--color-text)]">{{ day.label }}</span>
                  <span class="ml-2 text-sm text-[var(--color-muted)]">{{ day.date }}</span>
                </span>
                <span class="text-sm text-[var(--color-muted)]">{{ day.items.length ? `${day.items.length} 杯` : '无安排' }}</span>
              </div>
              <div v-if="day.items.length" class="mt-2 flex flex-wrap gap-2">
                <button
                  v-for="item in day.items"
                  :key="item.id"
                  type="button"
                  class="chip chip-active"
                  @click="scheduleStore.removeScheduleItem(item.id)"
                >
                  {{ item.recipeName }} ×
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-3">
          <button type="button" class="action-link" @click="close">关闭</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useScheduleStore, getWeekDates } from '../../stores/useScheduleStore';
import { useRecipeStore } from '../../stores/useRecipeStore';

interface SchedulePickerProps {
  visible: boolean;
  recipeId?: string;
  recipeName?: string;
}

const props = withDefaults(defineProps<SchedulePickerProps>(), {
  recipeId: '',
  recipeName: ''
});
const emit = defineEmits<{ close: [] }>();

const scheduleStore = useScheduleStore();
const recipeStore = useRecipeStore();

const WEEKDAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] as const;

const weekDays = computed(() => {
  const dates = getWeekDates(new Date());
  return dates.map((date, index) => {
    const items = scheduleStore.getItemsByDate(date).map((item) => ({
      ...item,
      recipeName: recipeStore.getRecipeById(item.recipeId)?.name ?? '未知配方'
    }));
    return {
      date,
      label: WEEKDAY_LABELS[index],
      scheduled: props.recipeId ? scheduleStore.isRecipeScheduledOnDate(date, props.recipeId) : false,
      items
    };
  });
});

function toggle(date: string): void {
  if (!props.recipeId) {
    return;
  }
  if (scheduleStore.isRecipeScheduledOnDate(date, props.recipeId)) {
    const item = scheduleStore.getItemsByDate(date).find((i) => i.recipeId === props.recipeId);
    if (item) {
      scheduleStore.removeScheduleItem(item.id);
    }
  } else {
    scheduleStore.addScheduleItem(date, props.recipeId);
  }
}

function close(): void {
  emit('close');
}
</script>
