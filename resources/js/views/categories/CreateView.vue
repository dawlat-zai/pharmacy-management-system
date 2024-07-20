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
                    <v-card-title class="px-8 py-4">{{ $t('categories.create.title') }}</v-card-title>
                    <v-divider></v-divider>
                    <v-form @submit.prevent="submit">
                        <v-container class="pa-8">
                            <v-row>
                                <v-col cols="12" md="6" class="pb-2 pt-0">
                                    <CustomInputText
                                        name="name"
                                        :label="t('categories.form.labelCategoryName')"
                                    ></CustomInputText>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6" class="py-2">
                                    <CustomTextarea
                                        name="description"
                                        :label="t('categories.form.labelCategoryDescription')"
                                    ></CustomTextarea>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6" class="pt-4">
                                    <v-btn type="submit" color="primary" flat rounded="lg" class="me-4">{{
                                        $t('buttonSave')
                                    }}</v-btn>
                                    <v-btn
                                        @click="router.go(-1)"
                                        color="primary"
                                        flat
                                        variant="outlined"
                                        rounded="lg"
                                        >{{ $t('buttonCancel') }}</v-btn
                                    >
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
import CategoryService from '@/client/services/CategoryService';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSuccessMessageStore } from '@/store';
import { useErrorMessageStore } from '@/store/errorMessage';
import { AxiosError } from 'axios';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import CustomInputText from '@/components/form/CustomTextInput.vue';
import { Category } from '@/client/models/Category';
import { CategoryInput } from '@/client/models/CategoryInput';
import CustomTextarea from '@/components/form/CustomTextarea.vue';

const router = useRouter();

const { t } = useI18n();

const schema = yup.object({
    name: yup.string().required(),
    description: yup.string().nullable(),
});

const { handleSubmit } = useForm({
    validationSchema: schema,
    initialValues: <CategoryInput>{
        name: '',
        description: '',
    },
});

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

const submit = handleSubmit((values) => {
    const categoryPermission = <CategoryInput>{ ...values };
    CategoryService.create(categoryPermission)
        .then((category: Category) => {
            successMessageStore.triggerSuccessMessage(t('categories.create.successMessage'));
            router.push({ name: 'categories' });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
});

const breadcrumbItems = ref([
    {
        title: 'Categories',
        disabled: false,
        to: { name: 'categories' },
    },
    {
        title: 'Create Category',
        disabled: true,
    },
]);
</script>
