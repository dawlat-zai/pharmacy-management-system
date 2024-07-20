<template>
    <v-container fluid class="px-8">
        <v-breadcrumbs :items="breadcrumbItems">
            <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
        </v-breadcrumbs>
        <v-row>
            <v-col cols="12" md="8">
                <v-card rounded="lg">
                    <v-card-title class="px-8 py-4">{{ $t('products.create.title') }}</v-card-title>
                    <v-divider></v-divider>
                    <v-form @submit.prevent="submit">
                        <v-container class="pa-8">
                            <v-row>
                                <v-col cols="12" md="8" class="pb-2 pt-0">
                                    <CustomInputText
                                        name="name"
                                        :label="t('products.form.labelProductName')"
                                    ></CustomInputText>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="4" class="py-2">
                                    <CustomSelect
                                        name="category_id"
                                        :label="t('products.form.labelCategory')"
                                        :items="categories"
                                    ></CustomSelect>
                                </v-col>
                                <v-col cols="12" md="4" class="py-2">
                                    <CustomSelect
                                        name="product_type_id"
                                        :label="t('products.form.labelProductType')"
                                        :items="productTypes"
                                    ></CustomSelect>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="8" class="py-2">
                                    <CustomTextarea
                                        name="description"
                                        :label="t('products.form.labelDescription')"
                                    ></CustomTextarea>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="4" class="py-2">
                                    <CustomInputText
                                        name="manufacture_date"
                                        type="date"
                                        :label="t('products.form.labelManufactureDate')"
                                    ></CustomInputText>
                                </v-col>
                                <v-col cols="12" md="4" class="py-2">
                                    <CustomInputText
                                        name="expiry_date"
                                        type="date"
                                        :label="t('products.form.labelExpiryDate')"
                                    ></CustomInputText>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="4" class="py-2">
                                    <CustomInputText
                                        name="purchase_price"
                                        type="number"
                                        :label="t('products.form.labelPurchasePrice')"
                                    ></CustomInputText>
                                </v-col>
                                <v-col cols="12" md="4" class="py-2">
                                    <CustomInputText
                                        name="sale_price"
                                        type="number"
                                        :label="t('products.form.labelSalePrice')"
                                    ></CustomInputText>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="4" class="py-2">
                                    <CustomInputText
                                        name="quantity"
                                        type="number"
                                        :label="t('products.form.labelQuantity')"
                                    ></CustomInputText>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="4" class="pt-4">
                                    <v-btn type="submit" color="primary" flat rounded="lg" class="me-4">{{
                                        $t('buttonSave')
                                    }}</v-btn>
                                    <v-btn @click="router.go(-1)" color="primary" variant="outlined" rounded="lg">{{
                                        $t('buttonCancel')
                                    }}</v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import ProductService from '@/client/services/ProductService';
import CategoryService from '@/client/services/CategoryService';
import ProductTypeService from '@/client/services/ProductTypeService';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSuccessMessageStore } from '@/store';
import { useErrorMessageStore } from '@/store/errorMessage';
import { AxiosError } from 'axios';
import { useI18n } from 'vue-i18n';
import CustomInputText from '@/components/form/CustomTextInput.vue';
import CustomSelect from '@/components/form/CustomSelect.vue';
import { Product } from '@/client/models/Product';
import { ProductInput } from '@/client/models/ProductInput';
import CustomTextarea from '@/components/form/CustomTextarea.vue';
import { ref } from 'vue';
import { Select } from '@/types/Select';
import { onMounted } from 'vue';

const router = useRouter();

const { t } = useI18n();

const categories = ref<Select[]>([]);
const productTypes = ref<Select[]>([]);

const schema = yup.object({
    name: yup.string().required(),
    category_id: yup.number().required(),
    product_type_id: yup.number().required(),
    description: yup.string().nullable(),
    manufacture_date: yup.string().required(),
    expiry_date: yup.string().required(),
    purchase_price: yup.number().required(),
    sale_price: yup.number().required(),
    quantity: yup.number().required(),
});

const { handleSubmit } = useForm({
    validationSchema: schema,
    initialValues: <ProductInput>{
        name: '',
        description: '',
        manufacture_date: '',
        expiry_date: '',
        purchase_price: undefined,
        sale_price: undefined,
        quantity: undefined,
        category_id: undefined,
        product_type_id: undefined,
    },
});

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

const submit = handleSubmit((values) => {
    const product = <ProductInput>{ ...values };
    ProductService.create(product)
        .then((product: Product) => {
            successMessageStore.triggerSuccessMessage(t('products.create.successMessage'));
            router.push({ name: 'products' });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
});

onMounted(() => {
    getCategories();
    getProductTypes();
});

const getCategories = () => {
    CategoryService.getAll('', 100)
        .then((response: any) => {
            categories.value = response.data.map((category) => {
                return {
                    value: category.id,
                    title: category.name,
                };
            });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
};

const getProductTypes = () => {
    ProductTypeService.getAll('', 100)
        .then((response: any) => {
            productTypes.value = response.data.map((productType) => {
                return {
                    value: productType.id,
                    title: productType.name,
                };
            });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
};

const breadcrumbItems = ref([
    {
        title: 'Products',
        disabled: false,
        to: { name: 'products' },
    },
    {
        title: 'Create Product',
        disabled: true,
    },
]);
</script>
