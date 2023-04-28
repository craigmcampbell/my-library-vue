<script setup lang="ts">
import GenerateId from '@/helpers/UniqueId';

defineProps({
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  value: {
    type: [String, Number],
    required: true,
  },
  error: {
    type: String,
    default: '',
  },
});

const inputId = GenerateId();
</script>

<template>
  <input
    class="mr-1"
    type="radio"
    :checked="modelValue === value"
    :value="value"
    @change="$emit('update:modelValue', value)"
    v-bind="$attrs"
    :id="inputId"
    :aria-describedby="error ? `${inputId}-error` : undefined"
    :aria-invalid="error ? true : undefined"
  />
  <label v-if="label" :for="inputId">{{ label }}</label>
  <p v-if="error" class="text-red-500 text-xs" :id="`${inputId}-error`" aria-live="assertive">{{ error }}</p>
</template>
