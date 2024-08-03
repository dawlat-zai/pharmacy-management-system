<template>
    <v-container fluid class="px-8">
        <v-breadcrumbs :items="breadcrumbItems">
            <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
        </v-breadcrumbs>
        <v-card rounded="lg">
            <v-card-title class="px-8 py-4">{{ $t('sales.create.title') }}</v-card-title>
            <v-divider></v-divider>
            <div class="mx-8 my-4">
                <div class="my-2">Customer: Walk In</div>
                <div class="my-2">Date: 11/07/2024</div>
            </div>
            <v-table ref="scrollableDiv" class="mx-4 custom-table products-table" fixed-header density="comfortable">
                <thead>
                    <tr>
                        <th class="text-left" width="25%">Product</th>
                        <th class="text-left" width="15%">Type</th>
                        <th class="text-left" width="15%">Unit Price</th>
                        <th class="text-left" width="10%">Quantity</th>
                        <th class="text-left" width="10%">Total</th>
                        <th class="text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(product, index) in productsArray">
                        <td>
                            <v-autocomplete
                                v-model="product.name"
                                :items="productsDropdown"
                                variant="outlined"
                                color="primary"
                                density="compact"
                                rounded="lg"
                                hide-details="auto"
                                placeholder="Select Product"
                                @update:model-value="(value) => addToCart(index, value)"
                            ></v-autocomplete>
                        </td>
                        <td>{{ product.type }}</td>
                        <td>{{ product.unit_price }}</td>
                        <td>
                            <v-text-field
                                type="number"
                                v-model="product.quantity"
                                variant="outlined"
                                color="primary"
                                density="compact"
                                rounded="lg"
                                hide-details="auto"
                                placeholder="0"
                                min="1"
                                @update:model-value="updateQuantity(product)"
                            ></v-text-field>
                        </td>
                        <td>{{ product.total_price }}</td>
                        <td>
                            <div class="d-flex ga-2">
                                <v-btn color="danger" variant="tonal" @click="removeProduct(index)">
                                    <v-icon icon="mdi-delete"></v-icon>
                                </v-btn>
                                <v-btn
                                    v-if="productsArray.length - 1 === index"
                                    color="primary"
                                    variant="tonal"
                                    @click="addProduct"
                                >
                                    <v-icon icon="mdi-plus"></v-icon>
                                </v-btn>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>
            <v-table class="mx-4 my-8 custom-table" density="comfortable">
                <tbody>
                    <tr>
                        <td class="text-right text-h6">Sub total:</td>
                        <td width="230px" class="text-right text-h6">{{ subTotal }}</td>
                    </tr>
                    <tr>
                        <td class="text-right text-h6">Discount:</td>
                        <td class="text-right d-flex flex-wrap ga-3 justify-end">
                            <div style="width: 100px">
                                <v-text-field
                                    type="number"
                                    name="discount"
                                    v-model="discount"
                                    variant="outlined"
                                    color="primary"
                                    density="compact"
                                    rounded="lg"
                                    hide-details="auto"
                                    placeholder="0.00"
                                    min="0"
                                    @update:model-value="calculateTotal"
                                ></v-text-field>
                            </div>
                            <div style="width: 80px">
                                <v-select
                                    v-model="discountType"
                                    :items="discountTypes"
                                    variant="outlined"
                                    color="primary"
                                    density="compact"
                                    rounded="lg"
                                    hide-details="auto"
                                    @update:model-value="calculateTotal"
                                ></v-select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-right text-h6">Total:</td>
                        <td class="text-right text-h6">{{ total }}</td>
                    </tr>
                    <tr>
                        <td class="text-right text-h6">Payment:</td>
                        <td class="text-right text-h6">
                            <v-text-field
                                type="number"
                                name="discount"
                                v-model="payment"
                                variant="outlined"
                                color="primary"
                                density="compact"
                                rounded="lg"
                                hide-details="auto"
                                placeholder="0.00"
                                min="0"
                                @update:model-value="calculateChange"
                            ></v-text-field>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-right text-h6">Change:</td>
                        <td class="text-right text-h6">{{ change }}</td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div class="d-flex flex-wrap ga-4 justify-end mt-4">
                                <v-btn color="error" size="x-large" variant="tonal" style="width: 150px">Cancel</v-btn>
                                <v-btn
                                    color="primary"
                                    size="x-large"
                                    variant="flat"
                                    style="width: 150px"
                                    @click="saveOrder"
                                    >Save Order</v-btn
                                >
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Select } from '@/types/Select';
import { Product } from '@/client/models/Product';
import { SaleInput } from '@/client/models/SaleInput';
import { SaleItemInput } from '@/client/models/SaleItemInput';
import ProductService from '@/client/services/ProductService';
import SaleService from '@/client/services/SaleService';
import { onMounted } from 'vue';
import { useErrorMessageStore } from '@/store/errorMessage';
import { AxiosError } from 'axios';

const errorMessageStore = useErrorMessageStore();

const getEmptyProduct = () => {
    return {
        id: 0,
        name: '',
        type: '',
        unit_price: 0,
        quantity: 0,
        total_price: 0,
    };
};

const productsArray = ref([getEmptyProduct()]);

const productsDropdown = ref<Select[]>();

const products = ref<Product[]>([]);

const discountTypes = ref<Select[]>([
    { value: 'percentage', title: '%' },
    { value: 'flat', title: '$' },
]);

const scrollableDiv = ref(null);

const addProduct = () => {
    productsArray.value.push(getEmptyProduct());
};

const removeProduct = (index) => {
    productsArray.value.splice(index, 1);
    calculateTotal();
};

const addToCart = (index, productId) => {
    const cartProduct = productsArray.value.find((p, i) => i == index);
    const product = products.value.find((p) => p.id == productId);

    if (cartProduct !== undefined && product !== undefined) {
        cartProduct.id = product.id;
        cartProduct.name = product.name;
        cartProduct.type = product.product_type ? product.product_type.name : '';
        cartProduct.unit_price = product.sale_price;
        cartProduct.quantity = 1;
        cartProduct.total_price = product.sale_price * 1;
    }

    calculateTotal();
};

const updateQuantity = (product) => {
    product.total_price = product.unit_price * product.quantity;
    calculateTotal();
};

const subTotal = ref(0);
const discount = ref(0);
const discountType = ref('percentage');
const total = ref(0);
const payment = ref(0);
const change = ref(0);

const calculateTotal = () => {
    let st = 0;
    Object.values(productsArray.value).forEach((p) => {
        st += p.total_price;
    });
    subTotal.value = st;

    let totalDiscount = 0;
    if (discountType.value === 'percentage') {
        totalDiscount = subTotal.value * (discount.value / 100);
    } else {
        totalDiscount = discount.value;
    }

    total.value = subTotal.value - totalDiscount;

    calculateChange();
};

const calculateChange = () => {
    change.value = parseFloat((payment.value - total.value).toFixed(2));
};

onMounted(() => {
    getProducts();
});

const getProducts = () => {
    ProductService.getAll('', 100000)
        .then((response: any) => {
            products.value = response.data;
            productsDropdown.value = response.data.map((product) => {
                return {
                    value: product.id,
                    title: product.name,
                };
            });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
};

const saveOrder = () => {
    const sale = <SaleInput>{
        discount: discount.value,
        discount_type: discountType.value,
        items: productsArray.value.map((product) => {
            return <SaleItemInput>{
                product_id: product.id,
                quantity: product.quantity,
                price: product.unit_price,
            };
        }),
    };

    console.log('sale: ', sale);

    SaleService.create(sale)
        .then((response) => {
            newSale();
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
};

const newSale = () => {
    productsArray.value = [getEmptyProduct()];
    subTotal.value = 0;
    discount.value = 0;
    total.value = 0;
    payment.value = 0;
    change.value = 0;
}

const breadcrumbItems = ref([
    {
        title: 'Sales',
        disabled: false,
    },
    {
        title: 'Create',
        disabled: true,
    },
]);
</script>

<style scoped>
.custom-table.v-table.v-table--fixed-header > .v-table__wrapper > table > thead > tr > th {
    box-shadow: none !important;
}

.custom-table.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td,
.custom-table.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > th {
    border-bottom: none !important;
}

.products-table {
    max-height: 350px;
}
</style>
