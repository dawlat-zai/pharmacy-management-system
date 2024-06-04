<template>
    <v-row>
        <v-col cols="12" md="8">
            <v-card :title="t('users.edit.title')" rounded="lg">
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
import { UserInput } from '@/client/models/UserInput';
import UserService from '@/client/services/UserService';
import { useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSuccessMessageStore } from '@/store';
import { useErrorMessageStore } from '@/store/errorMessage';
import { AxiosError } from 'axios';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { User } from '@/client/models/User';
import InputText from '@/components/TextInput.vue';

const router = useRouter();

const { t } = useI18n();

const schema = yup.object({
    first_name: yup.string().required().label('First Name'),
    last_name: yup.string().required().label('Last Name'),
    email: yup.string().email().required().label('E-mail'),
    password: yup.string(),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords should match.'),
});

const { resetForm, handleSubmit } = useForm({
    validationSchema: schema,
});

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

const route = useRoute();

onMounted(() => {
    UserService.get(parseInt(route.params.id as string))
        .then((user: User) => {
            const form: UserInput = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: '',
                password_confirmation: ''
            }
            resetForm({ values: form });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
});

const submit = handleSubmit((values) => {
    const user = <UserInput>{ 
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email
    };

    if(values.password !== '') {
        user.password = values.password;
        user.password_confirmation = values.password_confirmation
    }

    const id = parseInt(route.params.id as string);

    UserService.update(id, user)
        .then((user: User) => {
            successMessageStore.triggerSuccessMessage('User updated successfully');
            router.push({ name: 'users' });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
});
</script>
