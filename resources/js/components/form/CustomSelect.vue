<template>
    <v-label class="mb-2 font-weight-medium">{{ props.label }}</v-label>
    <v-select
        v-model="value"
        :items="items"
        :error-messages="errorMessage"
        variant="outlined"
        color="primary"
        density="comfortable"
        rounded="lg"
        hide-details="auto"
        :placeholder="props.label"
    ></v-select>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { Select } from '@/types/Select';

const props = defineProps({
    name: {
        type: String,
        default: () => 'name'   
    },
    label: String,
    items: {
        type: Array as () => Select[],
        default: () => []   
    },
});

// The `name` is returned in a function because we want to make sure it stays reactive
// If the name changes you want `useField` to be able to pick it up
const { value, errorMessage } = useField<string>(() => props.name);
</script>
