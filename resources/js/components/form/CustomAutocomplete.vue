<template>
    <v-label v-if="label" class="mb-2 font-weight-medium">{{ props.label }}</v-label>
    <v-autocomplete
        v-model="value"
        :items="items"
        :error-messages="errorMessage"
        variant="outlined"
        color="primary"
        density="compact"
        rounded="lg"
        hide-details="auto"
        :placeholder="props.label"
        @update:model-value="onChange"
    ></v-autocomplete>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { Select } from '@/types/Select';

const emit = defineEmits(['onChange'])

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

const onChange = (value) => {
    emit('onChange', value);
}
</script>
