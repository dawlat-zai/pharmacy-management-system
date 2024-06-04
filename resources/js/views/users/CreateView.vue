<template>
    <v-row>
        <v-col cols="12" md="8">
            <v-card :title="t('users.create.title')" rounded="lg">
                <v-form @submit.prevent="submit">
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="4" class="pb-2 pt-0">
                                <InputText name="first_name" :label="t('users.form.labelFirstname')"></InputText>
                            </v-col>
                            <v-col cols="12" md="4" class="pb-2 pt-0">
                                <InputText name="last_name" :label="t('users.form.labelLastname')"></InputText>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4" class="py-2">
                                <InputText name="email" type="email" :label="t('users.form.labelEmail')"></InputText>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4" class="py-2">
                                <InputText name="password" type="password" :label="t('users.form.labelPassword')"></InputText>
                            </v-col>
                            <v-col cols="12" md="4" class="py-2">
                                <InputText name="password_confirmation" type="password" :label="t('users.form.labelPasswordConfirmation')"></InputText>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4" class="pt-4">
                                <v-btn type="submit" color="primary" rounded="lg" class="me-4">{{ $t('buttonSave') }}</v-btn>
                                <v-btn
                                    @click="router.go(-1)"
                                    color="primary"
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
</template>

<script setup lang="ts">
import { UserInput } from '@/client/models/UserInput';
import UserService from '@/client/services/UserService';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSuccessMessageStore } from '@/store';
import { useErrorMessageStore } from '@/store/errorMessage';
import { AxiosError } from 'axios';
import { useI18n } from 'vue-i18n';
import InputText from '@/components/TextInput.vue';
import { User } from '@/client/models/User';

const router = useRouter();

const { t } = useI18n();

const schema = yup.object({
    first_name: yup.string().required().label(t('users.form.labelFirstname')),
    last_name: yup.string().required().label(t('users.form.labelLastname')),
    email: yup.string().email().required().label(t('users.form.labelEmail')),
    password: yup.string().required().label(t('users.form.labelPassword')),
    password_confirmation: yup
        .string()
        .required()
        .oneOf([yup.ref('password')], t('users.form.passwordConfirmationCustomValidationMessage'))
        .label(t('users.form.labelPasswordConfirmation')),
});

const { handleSubmit } = useForm({
    validationSchema: schema,
    initialValues: <UserInput>{
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: ''
    },
});

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

const submit = handleSubmit((values) => {
    const user = <UserInput>{ ...values };
    UserService.create(user)
        .then((user: User) => {
            successMessageStore.triggerSuccessMessage(t('users.create.successMessage'));
            router.push({ name: 'users' });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
});
</script>
