<template>
    <v-container fluid class="px-8">
        <v-breadcrumbs :items="breadcrumbItems">
            <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
        </v-breadcrumbs>
        <v-card rounded="lg">
            <v-card-title class="px-8 py-4">{{ $t('categories.list.title') }}</v-card-title>
            <v-divider></v-divider>
            <v-card-item class="px-8 py-4">
                <v-text-field
                    v-model="searchKeyword"
                    :placeholder="t('categories.list.placeholderSearchCategory')"
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
                    <v-btn
                        v-if="permissionStore.hasPermission('create categories')"
                        :to="{ name: 'categories_create' }"
                        color="primary"
                        flat
                        rounded="lg"
                        >{{ $t('categories.list.btnCreateCategory') }}</v-btn
                    >
                </template>
            </v-card-item>

            <v-data-table-server
                v-model:items-per-page="categoriesPerPage"
                :headers="headers"
                :items="categories"
                :items-length="totalCategories"
                :loading="loading"
                :search="search"
                item-value="id"
                hover
                rounded="0"
                class="px-8 pt-0 pb-4 table-max-height"
                fixed-header
                @update:options="loadCategories"
            >
                <template v-slot:item.action="{ item }">
                    <span v-if="permissionStore.hasPermission('update categories')">
                        <v-icon @click="editCategory(item.id)" class="mr-2">mdi-pencil</v-icon>
                        <v-tooltip activator="parent" location="bottom">{{
                            $t('categories.list.tooltipEditCategory')
                        }}</v-tooltip>
                    </span>
                    <span>
                        <v-icon @click="openDeleteDialog(item)">mdi-delete</v-icon>
                        <v-tooltip activator="parent" location="bottom">{{
                            $t('categories.list.tooltipDeleteCategory')
                        }}</v-tooltip>
                    </span>
                </template>
            </v-data-table-server>
        </v-card>
    </v-container>

    <ConfirmationDialog
        v-model="dialogVisible"
        :title="t('categories.list.deleteConfirmationTitle')"
        :message="t('categories.list.deleteConfirmationMessage')"
        @confirm="deleteCategory"
        @cancel="cancelDelete"
    />
</template>

<script setup lang="ts">
import { Category } from '@/client/models/Category';
import CategoryService from '@/client/services/CategoryService';
import router from '@/router';
import { useErrorMessageStore, useLocaleStore, useSuccessMessageStore } from '@/store';
import { AxiosError } from 'axios';
import { watch } from 'vue';
import { ref } from 'vue';
import { VDataTable } from 'vuetify/lib/components/index.mjs';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import { useI18n } from 'vue-i18n';
import { usePermissionStore } from '@/store/permission';

const permissionStore = usePermissionStore();

const categories = ref<Category[]>();

const categoriesPerPage = ref(10);

const loading = ref(true);

const totalCategories = ref(0);

const { t } = useI18n();

const search = ref('');
const searchKeyword = ref('');

const localeStore = useLocaleStore();

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

let debounceTimeout: number = 0;

type ReadonlyHeaders = VDataTable['$props']['headers'];

const headers = ref<ReadonlyHeaders>([
    { title: t('categories.list.tableHeader.name'), key: 'name', align: 'start' },
    { title: t('categories.list.tableHeader.description'), key: 'description', align: 'start' },
    { title: t('categories.list.tableHeader.createdAt'), key: 'created_at', align: 'start' },
    { title: t('categories.list.tableHeader.updatedAt'), key: 'updated_at', align: 'start' },
    { title: '', key: 'action', align: 'end' },
]);

const loadCategories = ({ page, itemsPerPage, sortBy }: any) => {
    loading.value = true;
    CategoryService.getAll(searchKeyword.value, itemsPerPage, page, sortBy[0]?.key, sortBy[0]?.order)
        .then((response: any) => {
            console.log('response: ', response);
            categories.value = response.data;
            categoriesPerPage.value = response.pagination.per_page;
            totalCategories.value = response.pagination.total;
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

const editCategory = (id: number) => {
    router.push({ name: 'categories_edit', params: { id: id } });
};

const dialogVisible = ref(false);
const categoryToDelete = ref<Category | null>();

const openDeleteDialog = (category: Category) => {
    categoryToDelete.value = category;
    dialogVisible.value = true;
};

const deleteCategory = () => {
    if (categoryToDelete.value) {
        CategoryService.delete(categoryToDelete.value.id)
            .then((response) => {
                successMessageStore.triggerSuccessMessage('Category deleted successfully');
                triggerSearch();
            })
            .catch((error: AxiosError) => {
                errorMessageStore.triggerErrorMessage(error);
            });

        // Reset categoryToDelete after deleting
        categoryToDelete.value = null;
    }
    dialogVisible.value = false;
};

const cancelDelete = () => {
    categoryToDelete.value = null;
};
watch(
    () => localeStore.locale,
    (newLocale) => {
        headers.value = [
            { title: t('categories.list.tableHeader.name'), key: 'name', align: 'start' },
            { title: t('categories.list.tableHeader.description'), key: 'description', align: 'start' },
            { title: t('categories.list.tableHeader.createdAt'), key: 'created_at', align: 'start' },
            { title: t('categories.list.tableHeader.updatedAt'), key: 'updated_at', align: 'start' },
            { title: '', key: 'action', align: 'end' },
        ];
    },
);

const breadcrumbItems = ref([
    {
        title: 'Categories',
        disabled: true,
    },
]);
</script>
