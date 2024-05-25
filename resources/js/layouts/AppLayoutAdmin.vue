<template>
    <v-layout class="bg-grey-lighten-3">
        <v-navigation-drawer class="bg-primary">
            <v-list>
                <v-list-item
                    prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
                    :title="authStore.me?.first_name + ' ' + authStore.me?.last_name"
                ></v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <v-list-item
                    prepend-icon="mdi-home-city"
                    title="Dashboard"
                    value="dashboard"
                    :active="route.name == 'dashboard'"
                    :to="{ name: 'dashboard' }"
                ></v-list-item>
                <v-list-item
                    prepend-icon="mdi-account-group-outline"
                    title="Users"
                    value="users"
                    :active="(route.name as string).startsWith('users')"
                    :to="{ name: 'users' }"
                ></v-list-item>
            </v-list>

            <template v-slot:append>
                <div class="pa-2">
                    <v-btn block @click="authStore.logout()"> Logout </v-btn>
                </div>
            </template>
        </v-navigation-drawer>

        <v-main class="ma-8" style="height: calc(100vh - 64px)">
            <slot />

            <success-message />
            <error-message />
        </v-main>
    </v-layout>
</template>

<script setup lang="ts">
import { useAuthStore, useSuccessMessageStore } from '@/store';
import { useRoute } from 'vue-router';
import SuccessMessage from '@/components/SuccessMessage.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

const authStore = useAuthStore();

const route = useRoute();

const successMessageStore = useSuccessMessageStore();
</script>
