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
  error: {
    type: String,
    default: '',
  },
});

const inputId = GenerateId();
</script>

<template>
  <div class="flex flex-col mb-4">
    <label class="mb-2 uppercase font-bold text-lg text-grey-darkest" :for="inputId">{{ label }}</label>
    <input
      v-bind="$attrs"
      :placeholder="label"
      :value="modelValue"
      class="border py-2 px-3 text-grey-darkest"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :id="inputId"
      :aria-describedby="error ? `${inputId}-error` : undefined"
      :aria-invalid="error ? true : undefined"
    />
    <p v-if="error" class="text-red-500 text-xs" :id="`${inputId}-error`" aria-live="assertive">{{ error }}</p>
  </div>
</template>
