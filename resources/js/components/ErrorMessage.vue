<template>
    <v-snackbar
        v-model="errorMessageStore.showErrorMessage"
        :timeout="5000"
        color="error"
        location="top right"
        :close-on-back="false"
    >
        {{ errorMessageStore.message }}
    </v-snackbar>
</template>

<script setup>
import { useErrorMessageStore } from '@/store';

const errorMessageStore = useErrorMessageStore();
</script>
