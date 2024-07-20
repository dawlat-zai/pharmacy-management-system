<template>
    <v-locale-provider>
        <v-layout>
            <v-app-bar elevation="0">
                <v-app-bar-nav-icon variant="text" @click.stop="rail = !rail"></v-app-bar-nav-icon>

                <v-toolbar-title>Pharmacy Management System</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-menu transition="slide-y-transition">
                    <template v-slot:activator="{ props }">
                        <v-avatar class="mr-4" v-bind="props">
                            <v-img alt="John" src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
                        </v-avatar>
                    </template>
                    <v-list>
                        <v-list-item>
                            <v-list-item-title
                                ><v-btn color="primary" variant="plain">My Profile</v-btn></v-list-item-title
                            >
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title
                                ><v-btn color="primary" variant="plain" @click="authStore.logout()"
                                    >Logout</v-btn
                                ></v-list-item-title
                            >
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-app-bar>

            <v-navigation-drawer class="bg-blue-darken-4" :rail="rail">
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
                        prepend-icon="mdi-account"
                        :title="t('sidebarMenu.users')"
                        value="users"
                        :active="(route.name as string).startsWith('users')"
                        :to="{ name: 'users' }"
                    ></v-list-item>
                    <v-list-item
                        v-if="permissionStore.hasPermission('read roles')"
                        prepend-icon="mdi-account-group"
                        :title="t('sidebarMenu.roles')"
                        value="roles"
                        :active="(route.name as string).startsWith('roles')"
                        :to="{ name: 'roles' }"
                    ></v-list-item>
                    <v-list-item
                        v-if="permissionStore.hasPermission('read categories')"
                        prepend-icon="mdi-shape"
                        :title="t('sidebarMenu.categories')"
                        value="categories"
                        :active="(route.name as string).startsWith('categories')"
                        :to="{ name: 'categories' }"
                    ></v-list-item>
                    <v-list-item
                        v-if="permissionStore.hasPermission('read products')"
                        prepend-icon="mdi-pill"
                        :title="t('sidebarMenu.products')"
                        value="products"
                        :active="(route.name as string).startsWith('products')"
                        :to="{ name: 'products' }"
                    ></v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-main>
                <slot />

                <success-message />
                <error-message />
            </v-main>
        </v-layout>
    </v-locale-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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

const rail = ref(false);
</script>
