<template>
    <v-label v-if="label" class="mb-2 font-weight-medium">{{ label }}</v-label>
    <v-text-field
        :type="type || 'text'"
        v-model="value"
        :error-messages="errorMessage"
        variant="outlined"
        color="primary"
        density="compact"
        rounded="lg"
        hide-details="auto"
        :placeholder="placeholder"
    ></v-text-field>
</template>

<script setup>
import { useField } from 'vee-validate';

const props = defineProps({
    name: String,
    type: String,
    label: String,
    placeholder: String
});

// The `name` is returned in a function because we want to make sure it stays reactive
// If the name changes you want `useField` to be able to pick it up
const { value, errorMessage } = useField(() => props.name);

console.log('value: ', value);
</script>
