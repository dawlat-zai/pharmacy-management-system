<template>
    <v-row>
        <v-col cols="12" md="8">
            <v-card :title="t('categories.edit.title')" rounded="lg">
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
                                <v-btn type="submit" color="primary" rounded="lg">{{ $t('buttonSave') }}</v-btn>
                                <v-btn
                                    @click="router.go(-1)"
                                    color="primary"
                                    variant="outlined"
                                    rounded="lg"
                                    class="ml-4"
                                    >{{ $t('buttonCancel') }}</v-btn
                                >
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSuccessMessageStore } from '@/store';
import { useErrorMessageStore } from '@/store/errorMessage';
import { AxiosError } from 'axios';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import InputText from '@/components/TextInput.vue';
import { ref } from 'vue';
import { CategoryInput } from '@/client/models/CategoryInput';
import CategoryService from '@/client/services/CategoryService';
import { Category } from '@/client/models/Category';
import Textarea from '@/components/Textarea.vue';

const router = useRouter();

const { t } = useI18n();

const schema = yup.object({
    name: yup.string().required(),
    description: yup.string().nullable()
});

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

const route = useRoute();

const { resetForm, handleSubmit } = useForm({
    validationSchema: schema,
    initialValues: <CategoryInput>{
        name: '',
        description: '',
    },
});

onMounted(() => {
    getCategory();
});

const getCategory = () => {
    CategoryService.get(parseInt(route.params.id as string))
        .then((category: Category) => {
            const form: CategoryInput = {
                name: category.name,
                description: category.description
            }
            resetForm({ values: form });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
}

const submit = handleSubmit((values) => {
    const category = <CategoryInput>{ ...values };
    const id = parseInt(route.params.id as string);
    CategoryService.update(id, category)
        .then((category: Category) => {
            successMessageStore.triggerSuccessMessage(t('categories.edit.successMessage'));
            router.push({ name: 'categories' });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
});
</script>
