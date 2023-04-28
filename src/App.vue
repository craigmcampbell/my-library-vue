<script setup lang="ts">
import { RouterView } from 'vue-router';
import SiteHeader from './components/SiteHeader.vue';
</script>

<template>
  <SiteHeader />

  <div class="container justify-center">
    <RouterView />
  </div>
</template>
