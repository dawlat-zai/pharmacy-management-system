<template>
    <v-card rounded="lg">
        <v-card-title>{{ $t('products.list.title') }}</v-card-title>
        <v-card-item class="mb-4">
            <v-text-field
                v-model="searchKeyword"
                :placeholder="t('products.list.placeholderSearchProduct')"
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
                <v-btn v-if="permissionStore.hasPermission('create products')" :to="{ name: 'products_create' }" color="primary" rounded="lg">{{
                    $t('products.list.btnCreateProduct')
                }}</v-btn>
            </template>
        </v-card-item>

        <v-data-table-server
            v-model:items-per-page="productsPerPage"
            :headers="headers"
            :items="products"
            :items-length="totalProducts"
            :loading="loading"
            :search="search"
            item-value="id"
            hover
            rounded="0"
            @update:options="loadProducts"
        >
            <template v-slot:item.category="{ item }">
                {{ item.category?.name }}
            </template>
            <template v-slot:item.product_type="{ item }">
                {{ item.product_type?.name }}
            </template>
            <template v-slot:item.action="{ item }">
                <span v-if="permissionStore.hasPermission('update products')">
                    <v-icon @click="editProduct(item.id)" class="mr-2">mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="bottom">{{ $t('products.list.tooltipEditProduct') }}</v-tooltip>
                </span>
                <span>
                    <v-icon @click="openDeleteDialog(item)">mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="bottom">{{ $t('products.list.tooltipDeleteProduct') }}</v-tooltip>
                </span>
            </template>
        </v-data-table-server>
    </v-card>

    <ConfirmationDialog
        v-model="dialogVisible"
        :title="t('products.list.deleteConfirmationTitle')"
        :message="t('products.list.deleteConfirmationMessage')"
        @confirm="deleteProduct"
        @cancel="cancelDelete"
    />
</template>

<script setup lang="ts">
import { Product } from '@/client/models/Product';
import ProductService from '@/client/services/ProductService';
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

const products = ref<Product[]>();

const productsPerPage = ref(10);

const loading = ref(true);

const totalProducts = ref(0);

const { t } = useI18n();

const search = ref('');
const searchKeyword = ref('');

const localeStore = useLocaleStore();

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

let debounceTimeout: number = 0;

type ReadonlyHeaders = VDataTable['$props']['headers'];

const headers = ref<ReadonlyHeaders>([
    { title: t('products.list.tableHeader.name'), key: 'name', align: 'start' },
    { title: t('products.list.tableHeader.category'), key: 'category', sortable: false, align: 'start' },
    { title: t('products.list.tableHeader.product_type'), key: 'product_type', sortable: false, align: 'start' },
    { title: t('products.list.tableHeader.manufacture_date'), key: 'manufacture_date', align: 'start' },
    { title: t('products.list.tableHeader.expiry_date'), key: 'expiry_date', align: 'start' },
    { title: t('products.list.tableHeader.purchase_price'), key: 'purchase_price', align: 'start' },
    { title: t('products.list.tableHeader.sale_price'), key: 'sale_price', align: 'start' },
    { title: t('products.list.tableHeader.quantity'), key: 'quantity', align: 'start' },
    { title: '', key: 'action', align: 'end' },
]);

const loadProducts = ({ page, itemsPerPage, sortBy }: any) => {
    loading.value = true;
    ProductService.getAll(searchKeyword.value, itemsPerPage, page, sortBy[0]?.key, sortBy[0]?.order)
        .then((response: any) => {
            console.log('response: ', response);
            products.value = response.data;
            productsPerPage.value = response.pagination.per_page;
            totalProducts.value = response.pagination.total;
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

const editProduct = (id: number) => {
    router.push({ name: 'products_edit', params: { id: id } });
};

const dialogVisible = ref(false);
const productToDelete = ref<Product | null>();

const openDeleteDialog = (product: Product) => {
    productToDelete.value = product;
    dialogVisible.value = true;
};

const deleteProduct = () => {
    if (productToDelete.value) {
        ProductService.delete(productToDelete.value.id)
            .then((response) => {
                successMessageStore.triggerSuccessMessage('Product deleted successfully');
                triggerSearch();
            })
            .catch((error: AxiosError) => {
                errorMessageStore.triggerErrorMessage(error);
            });

        // Reset productToDelete after deleting
        productToDelete.value = null;
    }
    dialogVisible.value = false;
};

const cancelDelete = () => {
    productToDelete.value = null;
};
watch(
    () => localeStore.locale,
    (newLocale) => {
        headers.value = [
            { title: t('products.list.tableHeader.name'), key: 'name', align: 'start' },
            { title: t('products.list.tableHeader.category'), key: 'category', align: 'start' },
            { title: t('products.list.tableHeader.product_type'), key: 'product_type', align: 'start' },
            { title: t('products.list.tableHeader.manufacture_date'), key: 'manufacture_date', align: 'start' },
            { title: t('products.list.tableHeader.expiry_date'), key: 'expiry_date', align: 'start' },
            { title: t('products.list.tableHeader.purchase_price'), key: 'purchase_price', align: 'start' },
            { title: t('products.list.tableHeader.sale_price'), key: 'sale_price', align: 'start' },
            { title: t('products.list.tableHeader.quantity'), key: 'quantity', align: 'start' },
            { title: '', key: 'action', align: 'end' },
        ]
    },
);
</script>
