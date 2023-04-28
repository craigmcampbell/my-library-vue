<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps({
  routeName: {
    type: String,
    required: true,
  },
  menuText: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <RouterLink
    class="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4"
    :to="{ name: routeName }"
    >{{ menuText }}</RouterLink
  >
</template>

<styles scoped></styles>
