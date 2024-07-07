<template>
    <v-row>
        <v-col cols="12" md="8">
            <v-card :title="t('products.edit.title')" rounded="lg">
                <v-form @submit.prevent="submit">
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="8" class="pb-4 pt-0">
                                <InputText name="name" :label="t('products.form.labelProductName')"></InputText>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4" class="pb-4 pt-0">
                                <CustomSelect
                                    name="category_id"
                                    :label="t('products.form.labelCategory')"
                                    :items="categories"
                                ></CustomSelect>
                            </v-col>
                            <v-col cols="12" md="4" class="pb-4 pt-0">
                                <CustomSelect
                                    name="product_type_id"
                                    :label="t('products.form.labelProductType')"
                                    :items="productTypes"
                                ></CustomSelect>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="8" class="pb-4 pt-0">
                                <Textarea name="description" :label="t('products.form.labelDescription')"></Textarea>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4" class="pb-4 pt-0">
                                <InputText
                                    name="manufacture_date"
                                    type="date"
                                    :label="t('products.form.labelManufactureDate')"
                                ></InputText>
                            </v-col>
                            <v-col cols="12" md="4" class="pb-4 pt-0">
                                <InputText
                                    name="expiry_date"
                                    type="date"
                                    :label="t('products.form.labelExpiryDate')"
                                ></InputText>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4" class="pb-4 pt-0">
                                <InputText
                                    name="purchase_price"
                                    type="number"
                                    :label="t('products.form.labelPurchasePrice')"
                                ></InputText>
                            </v-col>
                            <v-col cols="12" md="4" class="pb-4 pt-0">
                                <InputText
                                    name="sale_price"
                                    type="number"
                                    :label="t('products.form.labelSalePrice')"
                                ></InputText>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4" class="pb-4 pt-0">
                                <InputText
                                    name="quantity"
                                    type="number"
                                    :label="t('products.form.labelQuantity')"
                                ></InputText>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4" class="pt-4">
                                <v-btn type="submit" color="primary" rounded="lg" class="me-4">{{
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
</template>

<script setup lang="ts">
import ProductService from '@/client/services/ProductService';
import CategoryService from '@/client/services/CategoryService';
import ProductTypeService from '@/client/services/ProductTypeService';
import { useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSuccessMessageStore } from '@/store';
import { useErrorMessageStore } from '@/store/errorMessage';
import { AxiosError } from 'axios';
import { useI18n } from 'vue-i18n';
import InputText from '@/components/TextInput.vue';
import CustomSelect from '@/components/CustomSelect.vue';
import { Product } from '@/client/models/Product';
import { ProductInput } from '@/client/models/ProductInput';
import Textarea from '@/components/Textarea.vue';
import { ref } from 'vue';
import { Select } from '@/types/Select';
import { onMounted } from 'vue';

const router = useRouter();

const route = useRoute();

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

const { resetForm, handleSubmit } = useForm({
    validationSchema: schema,
    initialValues: <ProductInput>{
        name: '',
        description: '',
        manufacture_date: '',
        expiry_date: '',
        purchase_price: null,
        sale_price: null,
        quantity: null,
        category_id: null,
        product_type_id: null,
    },
});

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

const submit = handleSubmit((values) => {
    const product = <ProductInput>{ ...values };
    const id = parseInt(route.params.id as string);
    ProductService.update(id, product)
        .then((product: Product) => {
            successMessageStore.triggerSuccessMessage(t('products.edit.successMessage'));
            router.push({ name: 'products' });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
});

onMounted(() => {
    getCategories();
    getProductTypes();
    getProduct();
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

const getProduct = () => {
    const id = parseInt(route.params.id as string);
    ProductService.get(id)
        .then((product: Product) => {
            const form: ProductInput = {
                name: product.name,
                description: product.description,
                manufacture_date: product.manufacture_date,
                expiry_date: product.expiry_date,
                purchase_price: product.purchase_price,
                sale_price: product.sale_price,
                quantity: product.quantity,
                category_id: product.category?.id,
                product_type_id: product.product_type?.id,
            };
            resetForm({ values: form });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
};
</script>
