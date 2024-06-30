<template>
    <v-select
        v-model="value"
        :items="items"
        :label="props.label"
        :error-messages="errorMessage"
        chips
        multiple
        variant="outlined"
        color="primary"
        density="compact"
        rounded="lg"
        hide-details="auto"
    ></v-select>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { MultiSelect } from '@/types/MultiSelect';

const props = defineProps({
    name: {
        type: String,
        default: () => 'name'   
    },
    label: String,
    items: {
        type: Array as () => MultiSelect[],
        default: () => []   
    },
});

// The `name` is returned in a function because we want to make sure it stays reactive
// If the name changes you want `useField` to be able to pick it up
const { value, errorMessage } = useField<string[]>(() => props.name);
</script>
