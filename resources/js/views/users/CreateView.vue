<template>
    <v-row>
        <v-col cols="12" md="8">
            <v-card :title="t('users.create.title')" rounded="lg">
                <v-form @submit.prevent="submit">
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="4" class="pb-2 pt-0">
                                <v-text-field
                                    :label="t('users.form.labelFirstname')"
                                    v-model="firstName"
                                    v-bind="firstNameProps"
                                    variant="outlined"
                                    color="primary"
                                    density="compact"
                                    rounded="lg"
                                    hide-details="auto"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" class="pb-2 pt-0">
                                <v-text-field
                                    :label="t('users.form.labelLastname')"
                                    v-model="lastName"
                                    v-bind="lastNameProps"
                                    variant="outlined"
                                    color="primary"
                                    density="compact"
                                    rounded="lg"
                                    hide-details="auto"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4" class="py-2">
                                <v-text-field
                                    :label="t('users.form.labelEmail')"
                                    v-model="email"
                                    v-bind="emailProps"
                                    variant="outlined"
                                    color="primary"
                                    density="compact"
                                    rounded="lg"
                                    hide-details="auto"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4" class="py-2">
                                <v-text-field
                                    type="password"
                                    :label="t('users.form.labelPassword')"
                                    v-model="password"
                                    v-bind="passwordProps"
                                    variant="outlined"
                                    color="primary"
                                    density="compact"
                                    rounded="lg"
                                    hide-details="auto"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" class="py-2">
                                <v-text-field
                                    type="password"
                                    :label="t('users.form.labelPasswordConfirmation')"
                                    v-model="passwordConfirmation"
                                    v-bind="passwordConfirmationProps"
                                    variant="outlined"
                                    color="primary"
                                    density="compact"
                                    rounded="lg"
                                    hide-details="auto"
                                ></v-text-field>
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
import { UserCreate } from '@/client/models/UserCreate';
import UserService from '@/client/services/UserService';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSuccessMessageStore } from '@/store';
import { useErrorMessageStore } from '@/store/errorMessage';
import { AxiosError } from 'axios';
import { useI18n } from 'vue-i18n';

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

const { defineField, handleSubmit } = useForm({
    validationSchema: schema,
});

const vuetifyConfig = (state: any) => ({
    props: {
        'error-messages': state.errors,
    },
});

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

const [firstName, firstNameProps] = defineField('first_name', vuetifyConfig);
const [lastName, lastNameProps] = defineField('last_name', vuetifyConfig);
const [email, emailProps] = defineField('email', vuetifyConfig);
const [password, passwordProps] = defineField('password', vuetifyConfig);
const [passwordConfirmation, passwordConfirmationProps] = defineField('password_confirmation', vuetifyConfig);

const submit = handleSubmit((values) => {
    console.log('error');
    const user = <UserCreate>{ ...values };
    UserService.create(user)
        .then((response) => {
            successMessageStore.triggerSuccessMessage(t('users.create.successMessage'));
            router.push({ name: 'users' });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
});
</script>
