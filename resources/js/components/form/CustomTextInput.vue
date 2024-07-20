<template>
    <v-label class="mb-2 font-weight-medium">{{ props.label }}</v-label>
    <v-text-field
        :type="type || 'text'"
        v-model="value"
        :error-messages="errorMessage"
        variant="outlined"
        color="primary"
        density="comfortable"
        rounded="lg"
        hide-details="auto"
        :placeholder="props.label"
    ></v-text-field>
</template>

<script setup>
import { useField } from 'vee-validate';

const props = defineProps({
    name: String,
    type: String,
    label: String,
});

// The `name` is returned in a function because we want to make sure it stays reactive
// If the name changes you want `useField` to be able to pick it up
const { value, errorMessage } = useField(() => props.name);
</script>
