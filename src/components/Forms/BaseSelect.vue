<script setup lang="ts">
import type { PropType } from 'vue';
import type SelectOption from '@/models/selectoption.interface';
import GenerateId from '@/helpers/UniqueId';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array as PropType<SelectOption[]>,
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
  <div class="flex flex-col mb-4">
    <label v-if="props.label" class="mb-2 uppercase font-bold text-lg text-grey-darkest" :for="inputId">{{
      props.label
    }}</label>
    <select
      v-bind="{...$attrs, onChange: ($event) => {$emit('update:modelValue', ($event.target as HTMLSelectElement).value)}}"
      :value="props.modelValue"
      class="py-2 px-3 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
      :id="inputId"
      :aria-describedby="error ? `${inputId}-error` : undefined"
      :aria-invalid="error ? true : undefined"
    >
      <option
        v-for="option in props.options"
        :value="option.value"
        :key="option.value"
        :selected="option.value === props.modelValue"
      >
        {{ option.text }}
      </option>
    </select>
    <p v-if="error" class="text-red-500 text-xs" :id="`${inputId}-error`" aria-live="assertive">{{ error }}</p>
  </div>
</template>
