<template>
    <v-container fluid class="px-8">
        <v-breadcrumbs :items="breadcrumbItems">
            <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
        </v-breadcrumbs>
        <v-card rounded="lg">
            <v-card-title class="px-8 py-4">{{ $t('roles.list.title') }}</v-card-title>
            <v-divider></v-divider>
            <v-card-item class="px-8 py-4">
                <v-text-field
                    v-model="searchKeyword"
                    :placeholder="t('roles.list.placeholderSearchRoles')"
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
                    <v-btn :to="{ name: 'roles_create' }" color="primary" flat rounded="lg">{{
                        $t('roles.list.btnCreateRole')
                    }}</v-btn>
                </template>
            </v-card-item>

            <v-data-table-server
                v-model:items-per-page="rolesPerPage"
                :headers="headers"
                :items="roles"
                :items-length="totalRoles"
                :loading="loading"
                :search="search"
                item-value="id"
                hover
                rounded="0"
                class="px-8 pt-0 pb-4 table-max-height"
                fixed-header
                @update:options="loadRoles"
            >
                <template v-slot:item.action="{ item }">
                    <span>
                        <v-icon @click="editRole(item.id)" class="mr-2">mdi-pencil</v-icon>
                        <v-tooltip activator="parent" location="bottom">{{
                            $t('roles.list.tooltipEditRole')
                        }}</v-tooltip>
                    </span>
                    <span>
                        <v-icon @click="openDeleteDialog(item)">mdi-delete</v-icon>
                        <v-tooltip activator="parent" location="bottom">{{
                            $t('roles.list.tooltipDeleteRole')
                        }}</v-tooltip>
                    </span>
                </template>
            </v-data-table-server>
        </v-card>
    </v-container>

    <ConfirmationDialog
        v-model="dialogVisible"
        :title="t('roles.list.deleteConfirmationTitle')"
        :message="t('roles.list.deleteConfirmationMessage')"
        @confirm="deleteRole"
        @cancel="cancelDelete"
    />
</template>

<script setup lang="ts">
import { Role } from '@/client/models/Role';
import RoleService from '@/client/services/RoleService';
import router from '@/router';
import { useErrorMessageStore, useLocaleStore, useSuccessMessageStore } from '@/store';
import { AxiosError } from 'axios';
import { watch } from 'vue';
import { ref } from 'vue';
import { VDataTable } from 'vuetify/lib/components/index.mjs';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import { useI18n } from 'vue-i18n';

const roles = ref<Role[]>();

const rolesPerPage = ref(10);

const loading = ref(true);

const totalRoles = ref(0);

const { t } = useI18n();

const search = ref('');
const searchKeyword = ref('');

const localeStore = useLocaleStore();

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

let debounceTimeout: number = 0;

type ReadonlyHeaders = VDataTable['$props']['headers'];

const headers = ref<ReadonlyHeaders>([
    { title: t('roles.list.tableHeader.name'), key: 'name', align: 'start' },
    { title: t('roles.list.tableHeader.createdAt'), key: 'created_at', align: 'start' },
    { title: t('roles.list.tableHeader.updatedAt'), key: 'updated_at', align: 'start' },
    { title: '', key: 'action', align: 'end' },
]);

const loadRoles = ({ page, itemsPerPage, sortBy }: any) => {
    loading.value = true;
    RoleService.getAll(searchKeyword.value, itemsPerPage, page, sortBy[0]?.key, sortBy[0]?.order)
        .then((response: any) => {
            roles.value = response.data;
            rolesPerPage.value = response.pagination.per_page;
            totalRoles.value = response.pagination.total;
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

const editRole = (id: number) => {
    router.push({ name: 'roles_edit', params: { id: id } });
};

const dialogVisible = ref(false);
const roleToDelete = ref<Role | null>();

const openDeleteDialog = (role: Role) => {
    roleToDelete.value = role;
    dialogVisible.value = true;
};

const deleteRole = () => {
    if (roleToDelete.value) {
        RoleService.delete(roleToDelete.value.id)
            .then((response) => {
                successMessageStore.triggerSuccessMessage('Role deleted successfully');
                triggerSearch();
            })
            .catch((error: AxiosError) => {
                errorMessageStore.triggerErrorMessage(error);
            });

        // Reset roleToDelete after deleting
        roleToDelete.value = null;
    }
    dialogVisible.value = false;
};

const cancelDelete = () => {
    roleToDelete.value = null;
};
watch(
    () => localeStore.locale,
    (newLocale) => {
        headers.value = [
            { title: t('roles.list.tableHeader.name'), key: 'name', align: 'start' },
            { title: t('roles.list.tableHeader.createdAt'), key: 'created_at', align: 'start' },
            { title: t('roles.list.tableHeader.updatedAt'), key: 'updated_at', align: 'start' },
            { title: '', key: 'action', align: 'end' },
        ];
    },
);

const breadcrumbItems = ref([
    {
        title: 'Roles',
        disabled: true,
    },
]);
</script>
