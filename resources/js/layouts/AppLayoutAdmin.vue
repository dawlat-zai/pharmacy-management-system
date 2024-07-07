<template>
    <v-locale-provider>
        <v-layout class="bg-grey-lighten-3">
            <v-navigation-drawer class="bg-primary" permanent>
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
                        :title="t('sidebarMenu.dashboard')"
                        value="dashboard"
                        :active="route.name == 'dashboard'"
                        :to="{ name: 'dashboard' }"
                    ></v-list-item>
                    <v-list-item
                        v-if="permissionStore.hasPermission('read users')"
                        prepend-icon="mdi-account-group-outline"
                        :title="t('sidebarMenu.users')"
                        value="users"
                        :active="(route.name as string).startsWith('users')"
                        :to="{ name: 'users' }"
                    ></v-list-item>
                    <v-list-item
                        v-if="permissionStore.hasPermission('read roles')"
                        prepend-icon="mdi-account-group-outline"
                        :title="t('sidebarMenu.roles')"
                        value="roles"
                        :active="(route.name as string).startsWith('roles')"
                        :to="{ name: 'roles' }"
                    ></v-list-item>
                    <v-list-item
                        v-if="permissionStore.hasPermission('read categories')"
                        prepend-icon="mdi-account-group-outline"
                        :title="t('sidebarMenu.categories')"
                        value="categories"
                        :active="(route.name as string).startsWith('categories')"
                        :to="{ name: 'categories' }"
                    ></v-list-item>
                    <v-list-item
                        v-if="permissionStore.hasPermission('read products')"
                        prepend-icon="mdi-account-group-outline"
                        :title="t('sidebarMenu.products')"
                        value="products"
                        :active="(route.name as string).startsWith('products')"
                        :to="{ name: 'products' }"
                    ></v-list-item>
                </v-list>

                <template v-slot:append>
                    <div class="pa-2">
                        <v-btn block @click="authStore.logout()"> Logout </v-btn>
                    </div>
                </template>
            </v-navigation-drawer>

            <v-main class="ma-8" style="height: calc(100vh - 64px)">
                <!-- <LocaleSwitcher /> -->

                <slot />

                <success-message />
                <error-message />
            </v-main>
        </v-layout>
    </v-locale-provider>
</template>

<script setup lang="ts">
import { useAuthStore, useSuccessMessageStore } from '@/store';
import { useRoute } from 'vue-router';
import SuccessMessage from '@/components/SuccessMessage.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import { useI18n } from 'vue-i18n';
import { usePermissionStore } from '@/store/permission';

const authStore = useAuthStore();

const route = useRoute();

const { t } = useI18n();

const permissionStore = usePermissionStore();
</script>
