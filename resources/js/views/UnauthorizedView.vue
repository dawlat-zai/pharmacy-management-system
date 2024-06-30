<template>
    <v-container class="d-flex flex-column align-center justify-center fill-height">
        <v-card class="pa-5" max-width="600">
            <v-card-title class="text-center text-h4">{{ $t('unauthorized.title') }}</v-card-title>
            <v-card-subtitle class="text-center mb-5"> {{ $t('unauthorized.message') }} </v-card-subtitle>
            <v-btn color="primary" block rounded="lg" @click="goHome"> {{ $t('unauthorized.buttonGoHome') }} </v-btn>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
    router.push({ name: 'dashboard' });
};
</script>
