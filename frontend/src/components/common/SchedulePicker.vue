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

        <div class="mt-5 flex items-center gap-2">
          <button type="button" class="mini-button" @click="prevWeek">&larr; 上周</button>
          <input
            v-model="pickerDate"
            type="date"
            class="field flex-1"
            @change="handleDateChange"
          />
          <button type="button" class="mini-button" @click="nextWeek">下周 &rarr;</button>
        </div>

        <p v-if="recipeId" class="mt-3 text-sm text-[var(--color-muted)]">选择日期将配方安排到指定日程，同一日期可安排多杯。</p>

        <div class="mt-4 grid gap-2">
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
                <span v-if="day.isToday" class="ml-2 text-xs opacity-80">今天</span>
              </span>
              <span class="text-sm font-bold">{{ day.scheduled ? '已安排' : '安排' }}</span>
            </button>

            <div v-else class="border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-3">
              <div class="flex items-center justify-between">
                <span>
                  <span class="font-semibold text-[var(--color-text)]">{{ day.label }}</span>
                  <span class="ml-2 text-sm text-[var(--color-muted)]">{{ day.date }}</span>
                  <span v-if="day.isToday" class="ml-2 text-xs text-[var(--color-accent)] font-bold">今天</span>
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
import { computed, ref, watch } from 'vue';
import { useScheduleStore, getWeekDates, toDateString } from '../../stores/useScheduleStore';
import { useRecipeStore } from '../../stores/useRecipeStore';

interface SchedulePickerProps {
  visible: boolean;
  recipeId?: string;
  recipeName?: string;
  initialDate?: Date;
}

const props = withDefaults(defineProps<SchedulePickerProps>(), {
  recipeId: '',
  recipeName: '',
  initialDate: () => new Date()
});
const emit = defineEmits<{ close: [] }>();

const scheduleStore = useScheduleStore();
const recipeStore = useRecipeStore();

const WEEKDAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] as const;

const referenceDate = ref(new Date(props.initialDate));
const pickerDate = ref(toDateString(new Date(props.initialDate)));
const today = toDateString(new Date());

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      referenceDate.value = new Date(props.initialDate);
      pickerDate.value = toDateString(referenceDate.value);
    }
  }
);

const weekDays = computed(() => {
  const dates = getWeekDates(referenceDate.value);
  return dates.map((date, index) => {
    const items = scheduleStore.getItemsByDate(date).map((item) => ({
      ...item,
      recipeName: recipeStore.getRecipeById(item.recipeId)?.name ?? '未知配方'
    }));
    return {
      date,
      label: WEEKDAY_LABELS[index],
      isToday: date === today,
      scheduled: props.recipeId ? scheduleStore.isRecipeScheduledOnDate(date, props.recipeId) : false,
      items
    };
  });
});

function handleDateChange(): void {
  const parsed = new Date(pickerDate.value);
  if (!Number.isNaN(parsed.getTime())) {
    referenceDate.value = parsed;
  }
}

function prevWeek(): void {
  const next = new Date(referenceDate.value);
  next.setDate(next.getDate() - 7);
  referenceDate.value = next;
  pickerDate.value = toDateString(next);
}

function nextWeek(): void {
  const next = new Date(referenceDate.value);
  next.setDate(next.getDate() + 7);
  referenceDate.value = next;
  pickerDate.value = toDateString(next);
}

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
