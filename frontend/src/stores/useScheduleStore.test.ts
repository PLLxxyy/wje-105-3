import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { setActivePinia, createPinia } from 'pinia';
import { useScheduleStore, toDateString, getWeekDates } from './useScheduleStore';
import { STORAGE_KEYS } from '../utils/storage';

vi.stubGlobal('crypto', {
  randomUUID: (() => {
    let counter = 0;
    return () => `test-id-${++counter}`;
  })()
});

describe('toDateString', () => {
  it('将 Date 对象格式化为 YYYY-MM-DD 字符串', () => {
    const date = new Date(2025, 0, 15);
    expect(toDateString(date)).toBe('2025-01-15');
  });

  it('月份和日期不足两位时补零', () => {
    const date = new Date(2025, 5, 3);
    expect(toDateString(date)).toBe('2025-06-03');
  });
});

describe('getWeekDates', () => {
  it('以周一对基准，当传入周三时返回本周一到周日', () => {
    const wednesday = new Date(2025, 5, 11);
    const dates = getWeekDates(wednesday);
    expect(dates).toHaveLength(7);
    expect(dates[0]).toBe('2025-06-09');
    expect(dates[6]).toBe('2025-06-15');
  });

  it('当传入周日时，返回当周（以上周一为起点）', () => {
    const sunday = new Date(2025, 5, 15);
    const dates = getWeekDates(sunday);
    expect(dates[0]).toBe('2025-06-09');
    expect(dates[6]).toBe('2025-06-15');
  });

  it('当传入周一时，返回该周一到周日', () => {
    const monday = new Date(2025, 5, 9);
    const dates = getWeekDates(monday);
    expect(dates[0]).toBe('2025-06-09');
    expect(dates[6]).toBe('2025-06-15');
  });

  it('跨月的周也能正确生成', () => {
    const saturday = new Date(2025, 5, 28);
    const dates = getWeekDates(saturday);
    expect(dates[0]).toBe('2025-06-23');
    expect(dates[6]).toBe('2025-06-29');
  });

  it('跨年的周也能正确生成', () => {
    const wednesday = new Date(2024, 11, 31);
    const dates = getWeekDates(wednesday);
    expect(dates[0]).toBe('2024-12-30');
    expect(dates[6]).toBe('2025-01-05');
  });
});

describe('useScheduleStore - 排期增删', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('初始状态下排期为空', () => {
    const store = useScheduleStore();
    expect(store.scheduleItems).toEqual([]);
  });

  it('addScheduleItem 可以新增一条排期', () => {
    const store = useScheduleStore();
    const item = store.addScheduleItem('2025-06-10', 'recipe-1');
    expect(item.id).toBeDefined();
    expect(item.date).toBe('2025-06-10');
    expect(item.recipeId).toBe('recipe-1');
    expect(store.scheduleItems).toHaveLength(1);
  });

  it('getItemsByDate 返回指定日期的所有排期', () => {
    const store = useScheduleStore();
    store.addScheduleItem('2025-06-10', 'recipe-1');
    store.addScheduleItem('2025-06-10', 'recipe-2');
    store.addScheduleItem('2025-06-11', 'recipe-3');
    const items = store.getItemsByDate('2025-06-10');
    expect(items).toHaveLength(2);
    expect(items.map((i) => i.recipeId)).toEqual(['recipe-1', 'recipe-2']);
  });

  it('同一日期可安排多杯相同配方', () => {
    const store = useScheduleStore();
    store.addScheduleItem('2025-06-10', 'recipe-1');
    store.addScheduleItem('2025-06-10', 'recipe-1');
    const items = store.getItemsByDate('2025-06-10');
    expect(items).toHaveLength(2);
    expect(items[0].id).not.toBe(items[1].id);
  });

  it('isRecipeScheduledOnDate 判断指定日期是否有该配方', () => {
    const store = useScheduleStore();
    store.addScheduleItem('2025-06-10', 'recipe-1');
    expect(store.isRecipeScheduledOnDate('2025-06-10', 'recipe-1')).toBe(true);
    expect(store.isRecipeScheduledOnDate('2025-06-11', 'recipe-1')).toBe(false);
    expect(store.isRecipeScheduledOnDate('2025-06-10', 'recipe-2')).toBe(false);
  });

  it('removeScheduleItem 按 id 删除指定排期', () => {
    const store = useScheduleStore();
    const item = store.addScheduleItem('2025-06-10', 'recipe-1');
    store.addScheduleItem('2025-06-10', 'recipe-2');
    store.removeScheduleItem(item.id);
    const remaining = store.getItemsByDate('2025-06-10');
    expect(remaining).toHaveLength(1);
    expect(remaining[0].recipeId).toBe('recipe-2');
  });

  it('removeRecipeFromSchedule 移除该配方的所有排期', () => {
    const store = useScheduleStore();
    store.addScheduleItem('2025-06-10', 'recipe-1');
    store.addScheduleItem('2025-06-11', 'recipe-1');
    store.addScheduleItem('2025-06-10', 'recipe-2');
    store.removeRecipeFromSchedule('recipe-1');
    expect(store.scheduleItems).toHaveLength(1);
    expect(store.scheduleItems[0].recipeId).toBe('recipe-2');
  });

  it('getItemsForWeek 返回指定日期所在周的所有排期', () => {
    const store = useScheduleStore();
    store.addScheduleItem('2025-06-09', 'recipe-mon');
    store.addScheduleItem('2025-06-11', 'recipe-wed');
    store.addScheduleItem('2025-06-15', 'recipe-sun');
    store.addScheduleItem('2025-06-16', 'recipe-next-mon');
    const weekItems = store.getItemsForWeek(new Date(2025, 5, 11));
    expect(weekItems).toHaveLength(3);
    const recipeIds = weekItems.map((i) => i.recipeId);
    expect(recipeIds).toContain('recipe-mon');
    expect(recipeIds).toContain('recipe-wed');
    expect(recipeIds).toContain('recipe-sun');
    expect(recipeIds).not.toContain('recipe-next-mon');
  });
});

describe('useScheduleStore - localStorage 持久化', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('新增排期后会写入 localStorage', async () => {
    const store = useScheduleStore();
    store.addScheduleItem('2025-06-10', 'recipe-1');
    await nextTick();
    const raw = localStorage.getItem(STORAGE_KEYS.schedule);
    expect(raw).not.toBeNull();
    const stored = JSON.parse(raw as string);
    expect(stored).toHaveLength(1);
    expect(stored[0].recipeId).toBe('recipe-1');
    expect(stored[0].date).toBe('2025-06-10');
  });

  it('删除排期后会同步更新 localStorage', async () => {
    const store = useScheduleStore();
    const item = store.addScheduleItem('2025-06-10', 'recipe-1');
    await nextTick();
    store.removeScheduleItem(item.id);
    await nextTick();
    const raw = localStorage.getItem(STORAGE_KEYS.schedule);
    const stored = JSON.parse(raw as string);
    expect(stored).toEqual([]);
  });

  it('重新实例化 store 能从 localStorage 恢复数据', async () => {
    const storeA = useScheduleStore();
    storeA.addScheduleItem('2025-06-10', 'recipe-1');
    storeA.addScheduleItem('2025-06-11', 'recipe-2');
    await nextTick();

    setActivePinia(createPinia());
    const storeB = useScheduleStore();
    expect(storeB.scheduleItems).toHaveLength(2);
    expect(storeB.getItemsByDate('2025-06-10')).toHaveLength(1);
    expect(storeB.getItemsByDate('2025-06-11')).toHaveLength(1);
  });

  it('localStorage 无数据时使用默认空数组', () => {
    const store = useScheduleStore();
    expect(store.scheduleItems).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEYS.schedule)).toBe('[]');
  });
});

describe('首页今日安排场景', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('今日安排只返回当天的排期，不包含其他日期', () => {
    const store = useScheduleStore();
    const today = toDateString(new Date());
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    store.addScheduleItem(today, 'recipe-today-1');
    store.addScheduleItem(today, 'recipe-today-2');
    store.addScheduleItem(toDateString(tomorrow), 'recipe-tomorrow');
    store.addScheduleItem(toDateString(yesterday), 'recipe-yesterday');

    const todayItems = store.getItemsByDate(today);
    expect(todayItems).toHaveLength(2);
    const recipeIds = todayItems.map((i) => i.recipeId);
    expect(recipeIds).toContain('recipe-today-1');
    expect(recipeIds).toContain('recipe-today-2');
    expect(recipeIds).not.toContain('recipe-tomorrow');
    expect(recipeIds).not.toContain('recipe-yesterday');
  });

  it('当天没有排期时返回空数组', () => {
    const store = useScheduleStore();
    const today = toDateString(new Date());
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    store.addScheduleItem(toDateString(tomorrow), 'recipe-tomorrow');

    const todayItems = store.getItemsByDate(today);
    expect(todayItems).toEqual([]);
  });

  it('当天有多杯同一配方也会全部出现在今日安排', () => {
    const store = useScheduleStore();
    const today = toDateString(new Date());
    store.addScheduleItem(today, 'recipe-same');
    store.addScheduleItem(today, 'recipe-same');
    store.addScheduleItem(today, 'recipe-same');

    const todayItems = store.getItemsByDate(today);
    expect(todayItems).toHaveLength(3);
    todayItems.forEach((item) => {
      expect(item.recipeId).toBe('recipe-same');
    });
  });

  it('sortedScheduleItems 按日期升序排序，同日按创建时间升序', () => {
    vi.useFakeTimers();
    const store = useScheduleStore();
    vi.setSystemTime(new Date(2025, 5, 10, 10, 0, 0));
    const item1 = store.addScheduleItem('2025-06-10', 'recipe-1');
    vi.setSystemTime(new Date(2025, 5, 10, 11, 0, 0));
    const item2 = store.addScheduleItem('2025-06-10', 'recipe-2');
    vi.setSystemTime(new Date(2025, 5, 9, 10, 0, 0));
    store.addScheduleItem('2025-06-09', 'recipe-3');
    vi.useRealTimers();

    const items = store.sortedScheduleItems;
    expect(items[0].date).toBe('2025-06-09');
    expect(items[1].id).toBe(item1.id);
    expect(items[2].id).toBe(item2.id);
  });
});
