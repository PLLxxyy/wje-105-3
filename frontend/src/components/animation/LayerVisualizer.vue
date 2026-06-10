<template>
  <div class="relative mx-auto h-96 w-56">
    <div class="absolute inset-x-9 top-0 h-6 border-x-2 border-t-2 border-[var(--color-glass)]"></div>
    <div class="absolute inset-x-5 top-5 bottom-4 overflow-hidden border-x-4 border-b-4 border-[var(--color-glass)] bg-white/10 liquid-sway">
      <div class="absolute inset-x-0 bottom-0 flex h-full flex-col-reverse justify-start">
        <div
          v-for="layer in visibleLayers"
          :key="layer.id"
          class="relative shrink-0 transition-[height] duration-500 ease-out"
          :style="{ height: `${layer.visibleHeight}%`, backgroundColor: layer.color }"
          :title="layer.name"
        >
          <span class="absolute left-2 top-1 text-[10px] font-bold text-black/65">{{ layer.name }}</span>
        </div>
      </div>
      <div class="absolute inset-x-0 top-[18%] h-3 bg-white/20 blur-sm"></div>
    </div>
    <div class="absolute bottom-0 left-1/2 h-4 w-28 -translate-x-1/2 border-b-4 border-[var(--color-glass)]"></div>
  </div>
</template>

<script setup lang="ts">
export interface VisualLayer {
  id: string;
  name: string;
  color: string;
  visibleHeight: number;
}

interface LayerVisualizerProps {
  visibleLayers: VisualLayer[];
}

defineProps<LayerVisualizerProps>();
</script>
