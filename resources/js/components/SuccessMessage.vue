<template>
    <v-snackbar
        v-model="successMessageStore.showSuccessMessage"
        :timeout="5000"
        color="success"
        location="top right"
        :close-on-back="false"
    >
        {{ successMessageStore.message }}
    </v-snackbar>
</template>

<script setup>
import { useSuccessMessageStore } from '@/store';

const successMessageStore = useSuccessMessageStore();
</script>
