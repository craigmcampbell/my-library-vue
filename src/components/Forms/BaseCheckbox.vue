<script setup lang="ts">
import GenerateId from '@/helpers/UniqueId';

defineProps({
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Boolean,
    default: false,
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
    type="checkbox"
    :checked="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    :name="inputId"
    :aria-describedby="error ? `${inputId}-error` : undefined"
    :aria-invalid="error ? true : undefined"
  />
  <label v-if="label" :for="inputId">{{ label }}</label>
  <p v-if="error" class="text-red-500 text-xs" :id="`${inputId}-error`" aria-live="assertive">{{ error }}</p>
</template>
