<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 96 96"
    fill="none"
    role="img"
    :aria-label="label"
  >
    <g v-if="type === GLASS_TYPE.Coupe" :stroke="color" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 20h56c-2 18-12 31-28 31S22 38 20 20Z" />
      <path d="M48 51v24" />
      <path d="M32 78h32" />
    </g>
    <g v-else-if="type === GLASS_TYPE.Highball" :stroke="color" stroke-width="5" stroke-linejoin="round">
      <path d="M28 14h40l-5 68H33L28 14Z" />
      <path d="M33 31h30" stroke-linecap="round" />
    </g>
    <g v-else-if="type === GLASS_TYPE.Rocks" :stroke="color" stroke-width="5" stroke-linejoin="round">
      <path d="M24 28h48l-6 48H30L24 28Z" />
      <path d="M35 45h26" stroke-linecap="round" />
    </g>
    <g v-else-if="type === GLASS_TYPE.Martini" :stroke="color" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 18h64L48 52 16 18Z" />
      <path d="M48 52v25" />
      <path d="M32 80h32" />
    </g>
    <g v-else-if="type === GLASS_TYPE.Hurricane" :stroke="color" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M34 14h28c-6 13-6 22 0 34 7 15 2 28-14 34-16-6-21-19-14-34 6-12 6-21 0-34Z" />
      <path d="M37 38h22" />
    </g>
    <g v-else :stroke="color" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M31 18h34l-5 62H36L31 18Z" />
      <path d="M65 32c12 0 13 31-4 31" />
      <path d="M36 36h24" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GLASS_TYPE, GLASS_TYPE_LABELS } from '../../constants/enums';
import type { GlassType } from '../../types/enums';

interface GlassIconProps {
  type: GlassType;
  size?: number;
  color?: string;
}

const props = withDefaults(defineProps<GlassIconProps>(), {
  size: 42,
  color: 'currentColor'
});

const label = computed(() => GLASS_TYPE_LABELS[props.type]);
</script>
