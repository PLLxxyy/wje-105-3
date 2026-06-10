import { computed, ref, type ComputedRef, type Ref } from 'vue';

export function useFilter<T, F>(
  items: Ref<T[]>,
  initialFilters: F,
  filterFn: (item: T, filters: F) => boolean
): { filtered: ComputedRef<T[]>; filters: Ref<F>; resetFilters: () => void } {
  const filters = ref(initialFilters) as Ref<F>;

  const filtered = computed(() => items.value.filter((item) => filterFn(item, filters.value)));

  const resetFilters = (): void => {
    filters.value = structuredClone(initialFilters);
  };

  return { filtered, filters, resetFilters };
}
