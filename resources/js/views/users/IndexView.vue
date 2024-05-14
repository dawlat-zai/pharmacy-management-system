<template>
    <v-card title="Users">
        <v-text-field
            v-model="search"
            class="mx-4 mb-4 mt-0"
            placeholder="Search name..."
            hide-details
            variant="underlined"
        ></v-text-field>

        <v-data-table-server
            v-model:items-per-page="usersPerPage"
            :headers="headers"
            :items="users"
            :items-length="totalUsers"
            :loading="loading"
            :search="search"
            item-value="id"
            hover
            @update:options="loadUsers"
        >
        </v-data-table-server>
    </v-card>
</template>

<script setup>
import UserService from '@/client/services/UserService';
import { ref } from 'vue';

const users = ref([]);

const usersPerPage = ref(10);

const loading = ref(true);

const totalUsers = ref(0);

const search = ref('');

const headers = ref([
    { title: 'First name', key: 'first_name', align: 'start' },
    { title: 'Last Name', key: 'last_name', align: 'end' },
    { title: 'Email', key: 'email', align: 'end' },
    { title: '', key: 'action', align: 'end' },
]);

const loadUsers = ({ page, itemsPerPage, sortBy }) => {
    loading.value = true;
    UserService.getAll(search.value, itemsPerPage, page, sortBy[0]?.key, sortBy[0]?.order).then((response) => {
        users.value = response.data;
        usersPerPage.value = response.pagination.per_page;
        totalUsers.value = response.pagination.total;
        loading.value = false;
    });
};
</script>
