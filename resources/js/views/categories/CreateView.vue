<template>
    <v-row>
        <v-col cols="12" md="8">
            <v-card :title="t('categories.create.title')" rounded="lg">
                <v-form @submit.prevent="submit">
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="4" class="pb-2 pt-0">
                                <InputText name="name" :label="t('categories.form.labelCategoryName')"></InputText>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4" class="pb-2 pt-0">
                                <Textarea name="description" :label="t('categories.form.labelCategoryDescription')"></Textarea>
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
import CategoryService from '@/client/services/CategoryService';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSuccessMessageStore } from '@/store';
import { useErrorMessageStore } from '@/store/errorMessage';
import { AxiosError } from 'axios';
import { useI18n } from 'vue-i18n';
import InputText from '@/components/TextInput.vue';
import { Category } from '@/client/models/Category';
import { CategoryInput } from '@/client/models/CategoryInput';
import Textarea from '@/components/Textarea.vue';

const router = useRouter();

const { t } = useI18n();

const schema = yup.object({
    name: yup.string().required(),
    description: yup.string().nullable()
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
</script>
