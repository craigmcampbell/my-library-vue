<script setup lang="ts">
import type { PropType } from 'vue';
import type RadioOption from '@/models/radioOption.interface';

defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  options: {
    type: Array as PropType<RadioOption[]>,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  vertical: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <component
    v-for="option in options"
    :key="option.value"
    :is="vertical ? 'div' : 'span'"
    :class="{ horizontal: !vertical }"
  >
    <BaseRadio
      :value="option.value"
      :label="option.label"
      :name="name"
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
  /></component>
</template>

<style scoped>
.horizontal {
  margin-right: 20px;
}
</style>
