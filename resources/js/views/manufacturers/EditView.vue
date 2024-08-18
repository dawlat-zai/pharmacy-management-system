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
                    <v-card-title class="px-8 py-4">{{ $t('manufacturers.edit.title') }}</v-card-title>
                    <v-divider></v-divider>
                    <v-form @submit.prevent="submit">
                        <v-container class="pa-8">
                            <v-row>
                                <v-col cols="12" md="4" class="pb-2 pt-0">
                                    <CustomInputText
                                        name="name"
                                        :label="t('manufacturers.form.labelManufacturerName')"
                                    ></CustomInputText>
                                </v-col>
                                <v-col cols="12" md="4" class="py-2 pt-0">
                                    <CustomInputText
                                        name="email"
                                        type="email"
                                        :label="t('manufacturers.form.labelEmail')"
                                    ></CustomInputText>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="8" class="py-2">
                                    <CustomTextarea
                                        name="address"
                                        :label="t('manufacturers.form.labelAddress')"
                                    ></CustomTextarea>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="4" class="py-2">
                                    <CustomInputText
                                        name="phone_number"
                                        :label="t('manufacturers.form.labelPhoneNumber')"
                                    ></CustomInputText>
                                </v-col>
                                <v-col cols="12" md="4" class="py-2">
                                    <CustomInputText
                                        name="mobile_number"
                                        :label="t('manufacturers.form.labelMobileNumber')"
                                    ></CustomInputText>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="4" class="py-2">
                                    <CustomInputText
                                        name="contact_person"
                                        :label="t('manufacturers.form.labelContactPerson')"
                                    ></CustomInputText>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="4" class="py-2">
                                    <InputCheckbox
                                        name="is_active"
                                        :label="t('manufacturers.form.labelIsActive')"
                                    ></InputCheckbox>
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
import ManufacturerService from '@/client/services/ManufacturerService';
import { useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSuccessMessageStore } from '@/store';
import { useErrorMessageStore } from '@/store/errorMessage';
import { AxiosError } from 'axios';
import { useI18n } from 'vue-i18n';
import CustomInputText from '@/components/form/CustomTextInput.vue';
import { Manufacturer } from '@/client/models/Manufacturer';
import { ManufacturerInput } from '@/client/models/ManufacturerInput';
import CustomTextarea from '@/components/form/CustomTextarea.vue';
import InputCheckbox from '@/components/InputCheckbox.vue';
import { ref } from 'vue';
import { onMounted } from 'vue';

const router = useRouter();

const { t } = useI18n();

const route = useRoute();

const schema = yup.object({
    name: yup.string().required(),
    email: yup.string().required(),
    phone_number: yup.string().required(),
    mobile_number: yup.string().required(),
    address: yup.string().required(),
    contact_person: yup.string().required(),
    is_active: yup.boolean().required(),
});

const { resetForm, handleSubmit } = useForm({
    validationSchema: schema,
    initialValues: <ManufacturerInput>{
        name: '',
        email: '',
        address: '',
        phone_number: '',
        mobile_number: '',
        contact_person: '',
        is_active: true
    },
});

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

const submit = handleSubmit((values) => {
    const id = parseInt(route.params.id as string);
    const manufacturer = <ManufacturerInput>{ ...values };
    ManufacturerService.update(id, manufacturer)
        .then((manufacturer: Manufacturer) => {
            successMessageStore.triggerSuccessMessage(t('manufacturers.edit.successMessage'));
            router.push({ name: 'manufacturers' });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
});

onMounted(() => {
    getManufacturer();
});

const getManufacturer = () => {
    const id = parseInt(route.params.id as string);
    ManufacturerService.get(id)
        .then((manufacturer: Manufacturer) => {
            console.log('manufacturer: ', manufacturer);
            const form: ManufacturerInput = {
                name: manufacturer.name,
                email: manufacturer.email,
                address: manufacturer.address,
                phone_number: manufacturer.phone_number,
                mobile_number: manufacturer.mobile_number,
                contact_person: manufacturer.contact_person,
                is_active: manufacturer.is_active ? true : false
            };
            resetForm({ values: form });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
};

const breadcrumbItems = ref([
    {
        title: 'Manufacturers',
        disabled: false,
        to: { name: 'manufacturers' },
    },
    {
        title: 'Create Manufacturer',
        disabled: true,
    },
]);
</script>
