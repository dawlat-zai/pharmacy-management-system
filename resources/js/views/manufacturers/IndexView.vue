<template>
    <v-container fluid class="px-8">
        <v-breadcrumbs :items="breadcrumbItems">
            <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
        </v-breadcrumbs>
        <v-card rounded="lg">
            <v-card-title class="px-8 py-4">{{ $t('manufacturers.list.title') }}</v-card-title>
            <v-divider></v-divider>
            <v-card-item class="px-8 py-4">
                <v-text-field
                    v-model="searchKeyword"
                    :placeholder="t('manufacturers.list.placeholderSearchManufacturer')"
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
                        v-if="permissionStore.hasPermission('create manufacturers')"
                        :to="{ name: 'manufacturers_create' }"
                        color="primary"
                        flat
                        rounded="lg"
                        >{{ $t('manufacturers.list.btnCreateManufacturer') }}</v-btn
                    >
                </template>
            </v-card-item>

            <v-data-table-server
                v-model:items-per-page="manufacturersPerPage"
                :headers="headers"
                :items="manufacturers"
                :items-length="totalManufacturers"
                :loading="loading"
                :search="search"
                item-value="id"
                hover
                rounded="0"
                class="px-8 pt-0 pb-4 table-max-height"
                fixed-header
                @update:options="loadManufacturers"
            >
                <template v-slot:item.is_active="{ item }">
                    <v-icon v-if="item.is_active">mdi-check</v-icon>
                </template>
                <template v-slot:item.action="{ item }">
                    <span v-if="permissionStore.hasPermission('update manufacturers')">
                        <v-icon @click="editManufacturer(item.id)" class="mr-2">mdi-pencil</v-icon>
                        <v-tooltip activator="parent" location="bottom">{{
                            $t('manufacturers.list.tooltipEditManufacturer')
                        }}</v-tooltip>
                    </span>
                    <span v-if="permissionStore.hasPermission('delete manufacturers')">
                        <v-icon @click="openDeleteDialog(item)">mdi-delete</v-icon>
                        <v-tooltip activator="parent" location="bottom">{{
                            $t('manufacturers.list.tooltipDeleteManufacturer')
                        }}</v-tooltip>
                    </span>
                </template>
            </v-data-table-server>
        </v-card>
    </v-container>

    <ConfirmationDialog
        v-model="dialogVisible"
        :title="t('manufacturers.list.deleteConfirmationTitle')"
        :message="t('manufacturers.list.deleteConfirmationMessage')"
        @confirm="deleteManufacturer"
        @cancel="cancelDelete"
    />
</template>

<script setup lang="ts">
import { Manufacturer } from '@/client/models/Manufacturer';
import ManufacturerService from '@/client/services/ManufacturerService';
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

const manufacturers = ref<Manufacturer[]>();

const manufacturersPerPage = ref(10);

const loading = ref(true);

const totalManufacturers = ref(0);

const { t } = useI18n();

const search = ref('');
const searchKeyword = ref('');

const localeStore = useLocaleStore();

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

let debounceTimeout: number = 0;

type ReadonlyHeaders = VDataTable['$props']['headers'];

const headers = ref<ReadonlyHeaders>([
    { title: t('manufacturers.list.tableHeader.name'), key: 'name', align: 'start' },
    { title: t('manufacturers.list.tableHeader.email'), key: 'email', sortable: false, align: 'start' },
    { title: t('manufacturers.list.tableHeader.address'), key: 'address', sortable: false, align: 'start' },
    { title: t('manufacturers.list.tableHeader.phone_number'), key: 'phone_number', align: 'start' },
    { title: t('manufacturers.list.tableHeader.mobile_number'), key: 'mobile_number', align: 'start' },
    { title: t('manufacturers.list.tableHeader.contact_person'), key: 'contact_person', align: 'start' },
    { title: t('manufacturers.list.tableHeader.is_active'), key: 'is_active', align: 'start'},
    { title: '', key: 'action', align: 'end', width: 100 },
]);

const loadManufacturers = ({ page, itemsPerPage, sortBy }: any) => {
    loading.value = true;
    ManufacturerService.getAll(searchKeyword.value, itemsPerPage, page, sortBy[0]?.key, sortBy[0]?.order)
        .then((response: any) => {
            console.log('response: ', response);
            manufacturers.value = response.data;
            manufacturersPerPage.value = response.pagination.per_page;
            totalManufacturers.value = response.pagination.total;
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

const editManufacturer = (id: number) => {
    router.push({ name: 'manufacturers_edit', params: { id: id } });
};

const dialogVisible = ref(false);
const manufacturerToDelete = ref<Manufacturer | null>();

const openDeleteDialog = (manufacturer: Manufacturer) => {
    manufacturerToDelete.value = manufacturer;
    dialogVisible.value = true;
};

const deleteManufacturer = () => {
    if (manufacturerToDelete.value) {
        ManufacturerService.delete(manufacturerToDelete.value.id)
            .then((response) => {
                successMessageStore.triggerSuccessMessage('Manufacturer deleted successfully');
                triggerSearch();
            })
            .catch((error: AxiosError) => {
                errorMessageStore.triggerErrorMessage(error);
            });

        // Reset manufacturerToDelete after deleting
        manufacturerToDelete.value = null;
    }
    dialogVisible.value = false;
};

const cancelDelete = () => {
    manufacturerToDelete.value = null;
};
watch(
    () => localeStore.locale,
    (newLocale) => {
        headers.value = [
            { title: t('manufacturers.list.tableHeader.name'), key: 'name', align: 'start' },
            { title: t('manufacturers.list.tableHeader.email'), key: 'email', sortable: false, align: 'start' },
            { title: t('manufacturers.list.tableHeader.address'), key: 'address', sortable: false, align: 'start' },
            { title: t('manufacturers.list.tableHeader.phone_number'), key: 'phone_number', align: 'start' },
            { title: t('manufacturers.list.tableHeader.mobile_number'), key: 'mobile_number', align: 'start' },
            { title: t('manufacturers.list.tableHeader.contact_person'), key: 'contact_person', align: 'start' },
            { title: t('manufacturers.list.tableHeader.is_active'), key: 'is_active', align: 'start'},
            { title: '', key: 'action', align: 'end', width: 100 },
        ];
    },
);

const breadcrumbItems = ref([
    {
        title: 'Manufacturers',
        disabled: true,
    },
]);
</script>
