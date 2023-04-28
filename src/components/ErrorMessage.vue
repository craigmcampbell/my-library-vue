<script setup lang="ts">
defineProps({
  header: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
    <strong class="font-bold" v-html="header"></strong>
    <span class="block sm:inline" v-if="message">{{ message }}</span>
  </div>
</template>
