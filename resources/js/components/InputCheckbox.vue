<template>
    <v-checkbox
        :label="props.label"
        :value="props.value"
        v-model="value"
        :error-messages="errorMessage"
        variant="outlined"
        color="primary"
        density="compact"
        hide-details="auto"
    ></v-checkbox>
  </template>
  
  <script setup>
  import { useField } from 'vee-validate';
  
  const props = defineProps({
    name: String,
    label: String,
    value: Number
  });
  
  // The `name` is returned in a function because we want to make sure it stays reactive
  // If the name changes you want `useField` to be able to pick it up
  const { value, errorMessage } = useField(() => props.name);
  </script>
  