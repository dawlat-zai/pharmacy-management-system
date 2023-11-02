<template>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style lang="scss">
h1 {
  color: $color-primary;
}
</style>
