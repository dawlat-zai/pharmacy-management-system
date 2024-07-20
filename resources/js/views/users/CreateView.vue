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
                    <v-card-title class="px-8 py-4">{{ $t('users.create.title') }}</v-card-title>
                    <v-divider></v-divider>
                    <v-form @submit.prevent="submit">
                        <v-container class="pa-8">
                            <v-row>
                                <v-col cols="12" md="6" class="pb-2 pt-0">
                                    <CustomInputText
                                        name="first_name"
                                        :label="t('users.form.labelFirstname')"
                                    ></CustomInputText>
                                </v-col>
                                <v-col cols="12" md="6" class="pb-2 pt-0">
                                    <CustomInputText
                                        name="last_name"
                                        :label="t('users.form.labelLastname')"
                                    ></CustomInputText>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6" class="py-2">
                                    <CustomInputText
                                        name="email"
                                        type="email"
                                        :label="t('users.form.labelEmail')"
                                    ></CustomInputText>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6" class="py-2">
                                    <CustomInputText
                                        name="password"
                                        type="password"
                                        :label="t('users.form.labelPassword')"
                                    ></CustomInputText>
                                </v-col>
                                <v-col cols="12" md="6" class="py-2">
                                    <CustomInputText
                                        name="password_confirmation"
                                        type="password"
                                        :label="t('users.form.labelPasswordConfirmation')"
                                    ></CustomInputText>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6" md="6" class="py-2">
                                    <CustomMultiSelect
                                        name="roles"
                                        :label="t('users.form.labelRole')"
                                        :items="roles"
                                    ></CustomMultiSelect>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6" class="pt-4">
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
import { UserInput } from '@/client/models/UserInput';
import UserService from '@/client/services/UserService';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSuccessMessageStore } from '@/store';
import { useErrorMessageStore } from '@/store/errorMessage';
import { AxiosError } from 'axios';
import { useI18n } from 'vue-i18n';
import CustomInputText from '@/components/form/CustomTextInput.vue';
import { User } from '@/client/models/User';
import { onMounted } from 'vue';
import { ref } from 'vue';
import RoleService from '@/client/services/RoleService';
import { Select } from '@/types/Select';
import CustomMultiSelect from '@/components/form/CustomMultiSelect.vue';

const router = useRouter();

const { t } = useI18n();

const roles = ref<Select[]>([]);

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
    roles: yup.array().min(1).label(t('users.form.labelRole')),
});

const { handleSubmit } = useForm({
    validationSchema: schema,
    initialValues: <UserInput>{
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [],
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

onMounted(() => {
    getRoles();
});

const getRoles = () => {
    RoleService.getAll()
        .then((response: any) => {
            roles.value = response.data.map((role) => {
                return {
                    value: role.id,
                    title: role.name,
                };
            });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
};

const breadcrumbItems = ref([
    {
        title: 'Users',
        disabled: false,
        to: { name: 'users' },
    },
    {
        title: 'Create User',
        disabled: true,
    },
]);
</script>
