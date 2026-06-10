import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';
import type { ScheduleItem } from '../types/schedule';

function createId(): string {
  return crypto.randomUUID();
}

export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getWeekDates(referenceDate: Date): string[] {
  const day = referenceDate.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() + mondayOffset);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(toDateString(d));
  }
  return dates;
}

export const useScheduleStore = defineStore('schedule', () => {
  const scheduleItems = useLocalStorage<ScheduleItem[]>(STORAGE_KEYS.schedule, []);

  const sortedScheduleItems = computed(() =>
    [...scheduleItems.value].sort((left, right) => left.date.localeCompare(right.date) || left.createdAt - right.createdAt)
  );

  function getItemsByDate(date: string): ScheduleItem[] {
    return scheduleItems.value.filter((item) => item.date === date);
  }

  function getItemsForWeek(referenceDate: Date): ScheduleItem[] {
    const weekDates = getWeekDates(referenceDate);
    const weekSet = new Set(weekDates);
    return scheduleItems.value.filter((item) => weekSet.has(item.date));
  }

  function addScheduleItem(date: string, recipeId: string): ScheduleItem {
    const item: ScheduleItem = {
      id: createId(),
      date,
      recipeId,
      createdAt: Date.now()
    };
    scheduleItems.value = [...scheduleItems.value, item];
    return item;
  }

  function removeScheduleItem(id: string): void {
    scheduleItems.value = scheduleItems.value.filter((item) => item.id !== id);
  }

  function removeRecipeFromSchedule(recipeId: string): void {
    scheduleItems.value = scheduleItems.value.filter((item) => item.recipeId !== recipeId);
  }

  function isRecipeScheduledOnDate(date: string, recipeId: string): boolean {
    return scheduleItems.value.some((item) => item.date === date && item.recipeId === recipeId);
  }

  return {
    scheduleItems,
    sortedScheduleItems,
    getItemsByDate,
    getItemsForWeek,
    addScheduleItem,
    removeScheduleItem,
    removeRecipeFromSchedule,
    isRecipeScheduledOnDate
  };
});
