<template>
    <v-container fluid class="px-8">
        <v-breadcrumbs :items="breadcrumbItems">
            <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
        </v-breadcrumbs>
        <v-card rounded="lg">
            <v-card-title class="px-8 py-4">{{ $t('suppliers.list.title') }}</v-card-title>
            <v-divider></v-divider>
            <v-card-item class="px-8 py-4">
                <v-text-field
                    v-model="searchKeyword"
                    :placeholder="t('suppliers.list.placeholderSearchSupplier')"
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
                        v-if="permissionStore.hasPermission('create suppliers')"
                        :to="{ name: 'suppliers_create' }"
                        color="primary"
                        flat
                        rounded="lg"
                        >{{ $t('suppliers.list.btnCreateSupplier') }}</v-btn
                    >
                </template>
            </v-card-item>

            <v-data-table-server
                v-model:items-per-page="suppliersPerPage"
                :headers="headers"
                :items="suppliers"
                :items-length="totalSuppliers"
                :loading="loading"
                :search="search"
                item-value="id"
                hover
                rounded="0"
                class="px-8 pt-0 pb-4 table-max-height"
                fixed-header
                @update:options="loadSuppliers"
            >
                <template v-slot:item.is_active="{ item }">
                    <v-icon v-if="item.is_active">mdi-check</v-icon>
                </template>
                <template v-slot:item.action="{ item }">
                    <span v-if="permissionStore.hasPermission('update suppliers')">
                        <v-icon @click="editSupplier(item.id)" class="mr-2">mdi-pencil</v-icon>
                        <v-tooltip activator="parent" location="bottom">{{
                            $t('suppliers.list.tooltipEditSupplier')
                        }}</v-tooltip>
                    </span>
                    <span v-if="permissionStore.hasPermission('delete suppliers')">
                        <v-icon @click="openDeleteDialog(item)">mdi-delete</v-icon>
                        <v-tooltip activator="parent" location="bottom">{{
                            $t('suppliers.list.tooltipDeleteSupplier')
                        }}</v-tooltip>
                    </span>
                </template>
            </v-data-table-server>
        </v-card>
    </v-container>

    <ConfirmationDialog
        v-model="dialogVisible"
        :title="t('suppliers.list.deleteConfirmationTitle')"
        :message="t('suppliers.list.deleteConfirmationMessage')"
        @confirm="deleteSupplier"
        @cancel="cancelDelete"
    />
</template>

<script setup lang="ts">
import { Supplier } from '@/client/models/Supplier';
import SupplierService from '@/client/services/SupplierService';
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

const suppliers = ref<Supplier[]>();

const suppliersPerPage = ref(10);

const loading = ref(true);

const totalSuppliers = ref(0);

const { t } = useI18n();

const search = ref('');
const searchKeyword = ref('');

const localeStore = useLocaleStore();

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

let debounceTimeout: number = 0;

type ReadonlyHeaders = VDataTable['$props']['headers'];

const headers = ref<ReadonlyHeaders>([
    { title: t('suppliers.list.tableHeader.name'), key: 'name', align: 'start' },
    { title: t('suppliers.list.tableHeader.email'), key: 'email', sortable: false, align: 'start' },
    { title: t('suppliers.list.tableHeader.address'), key: 'address', sortable: false, align: 'start' },
    { title: t('suppliers.list.tableHeader.phone_number'), key: 'phone_number', align: 'start' },
    { title: t('suppliers.list.tableHeader.mobile_number'), key: 'mobile_number', align: 'start' },
    { title: t('suppliers.list.tableHeader.contact_person'), key: 'contact_person', align: 'start' },
    { title: t('suppliers.list.tableHeader.is_active'), key: 'is_active', align: 'start'},
    { title: '', key: 'action', align: 'end', width: 100 },
]);

const loadSuppliers = ({ page, itemsPerPage, sortBy }: any) => {
    loading.value = true;
    SupplierService.getAll(searchKeyword.value, itemsPerPage, page, sortBy[0]?.key, sortBy[0]?.order)
        .then((response: any) => {
            console.log('response: ', response);
            suppliers.value = response.data;
            suppliersPerPage.value = response.pagination.per_page;
            totalSuppliers.value = response.pagination.total;
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

const editSupplier = (id: number) => {
    router.push({ name: 'suppliers_edit', params: { id: id } });
};

const dialogVisible = ref(false);
const supplierToDelete = ref<Supplier | null>();

const openDeleteDialog = (supplier: Supplier) => {
    supplierToDelete.value = supplier;
    dialogVisible.value = true;
};

const deleteSupplier = () => {
    if (supplierToDelete.value) {
        SupplierService.delete(supplierToDelete.value.id)
            .then((response) => {
                successMessageStore.triggerSuccessMessage('Supplier deleted successfully');
                triggerSearch();
            })
            .catch((error: AxiosError) => {
                errorMessageStore.triggerErrorMessage(error);
            });

        // Reset supplierToDelete after deleting
        supplierToDelete.value = null;
    }
    dialogVisible.value = false;
};

const cancelDelete = () => {
    supplierToDelete.value = null;
};
watch(
    () => localeStore.locale,
    (newLocale) => {
        headers.value = [
            { title: t('suppliers.list.tableHeader.name'), key: 'name', align: 'start' },
            { title: t('suppliers.list.tableHeader.category'), key: 'category', align: 'start' },
            { title: t('suppliers.list.tableHeader.supplier_type'), key: 'supplier_type', align: 'start' },
            { title: t('suppliers.list.tableHeader.manufacture_date'), key: 'manufacture_date', align: 'start' },
            { title: t('suppliers.list.tableHeader.expiry_date'), key: 'expiry_date', align: 'start' },
            { title: t('suppliers.list.tableHeader.purchase_price'), key: 'purchase_price', align: 'start' },
            { title: t('suppliers.list.tableHeader.sale_price'), key: 'sale_price', align: 'start' },
            { title: t('suppliers.list.tableHeader.quantity'), key: 'quantity', align: 'start' },
            { title: '', key: 'action', align: 'end' },
        ];
    },
);

const breadcrumbItems = ref([
    {
        title: 'Suppliers',
        disabled: true,
    },
]);
</script>
