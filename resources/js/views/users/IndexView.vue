<template>
    <v-card rounded="lg">
        <v-card-title>Users</v-card-title>
        <v-card-item class="mb-4">
            <v-text-field
                v-model="searchKeyword"
                placeholder="Search user..."
                hide-details
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-magnify"
                single-line
                color="primary"
                rounded="lg"
                style="inline-size: 15rem"
            ></v-text-field>

            <template #append>
                <v-btn :to="{ name: 'users_create' }" color="primary" rounded="lg">Create user</v-btn>
            </template>
        </v-card-item>

        <v-data-table-server
            v-model:items-per-page="usersPerPage"
            :headers="headers"
            :items="users"
            :items-length="totalUsers"
            :loading="loading"
            :search="search"
            item-value="id"
            hover
            rounded="0"
            @update:options="loadUsers"
        >
            <template v-slot:item.action="{ item }">
                <span>
                    <v-icon @click="editUser(item.id)" class="mr-2">mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="bottom">Edit User</v-tooltip>
                </span>
                <span>
                    <v-icon @click="openDeleteDialog(item)">mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="bottom">Delete User</v-tooltip>
                </span>
            </template>
        </v-data-table-server>
    </v-card>

    <ConfirmationDialog
        v-model="dialogVisible"
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
        @confirm="deleteUser"
        @cancel="cancelDelete"
    />
</template>

<script setup lang="ts">
import { User } from '@/client/models/User';
import UserService from '@/client/services/UserService';
import router from '@/router';
import { useErrorMessageStore, useSuccessMessageStore } from '@/store';
import { AxiosError } from 'axios';
import { watch } from 'vue';
import { ref } from 'vue';
import { VDataTable } from 'vuetify/lib/components/index.mjs';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';

const users = ref<User[]>();

const usersPerPage = ref(10);

const loading = ref(true);

const totalUsers = ref(0);

const search = ref('');
const searchKeyword = ref('');

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

let debounceTimeout: number = 0;

type ReadonlyHeaders = VDataTable['$props']['headers'];

const headers: ReadonlyHeaders = [
    { title: 'First name', key: 'first_name', align: 'start' },
    { title: 'Last Name', key: 'last_name', align: 'start' },
    { title: 'Email', key: 'email', align: 'start' },
    { title: '', key: 'action', align: 'end' },
];

const loadUsers = ({ page, itemsPerPage, sortBy }: any) => {
    loading.value = true;
    UserService.getAll(searchKeyword.value, itemsPerPage, page, sortBy[0]?.key, sortBy[0]?.order)
        .then((response: any) => {
            users.value = response.data;
            usersPerPage.value = response.pagination.per_page;
            totalUsers.value = response.pagination.total;
            loading.value = false;
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
};

watch(searchKeyword, () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(function () {
        triggerSearch();
    }, 500); 
    
});

const triggerSearch = () => {
    search.value = Date.now().toString();
};

const editUser = (id: number) => {
    router.push({ name: 'users_edit', params: { id: id } });
};

const dialogVisible = ref(false);
const userToDelete = ref<User | null>();

const openDeleteDialog = (user: User) => {
    userToDelete.value = user;
    dialogVisible.value = true;
};

const deleteUser = () => {
    if (userToDelete.value) {
        console.log('Deleting user:', userToDelete.value);

        UserService.delete(userToDelete.value.id)
            .then((response) => {
                successMessageStore.triggerSuccessMessage('User deleted successfully');
                triggerSearch();
            })
            .catch((error: AxiosError) => {
                errorMessageStore.triggerErrorMessage(error);
            });

        // Reset userToDelete after deleting
        userToDelete.value = null;
    }
    dialogVisible.value = false;
};

const cancelDelete = () => {
    userToDelete.value = null;
};
</script>
