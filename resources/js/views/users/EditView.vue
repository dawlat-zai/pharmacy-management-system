<template>
    <v-row>
        <v-col cols="12" md="8">
            <v-card title="Edit user" rounded="lg">
                <v-form @submit.prevent="submit">
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="4" class="pb-2 pt-0">
                                <v-text-field
                                    label="First Name"
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
                                    label="Last Name"
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
                                    label="Email"
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
                                    label="Password"
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
                                    label="Password Confirmation"
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
                                <v-btn type="submit" color="primary" rounded="lg">Save</v-btn>
                                <v-btn
                                    @click="router.go(-1)"
                                    color="primary"
                                    variant="outlined"
                                    rounded="lg"
                                    class="ml-4"
                                    >Cancel</v-btn
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
import { UserUpdate } from '@/client/models/UserUpdate';
import UserService from '@/client/services/UserService';
import { useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSuccessMessageStore } from '@/store';
import { useErrorMessageStore } from '@/store/errorMessage';
import { AxiosError } from 'axios';
import { onMounted } from 'vue';

const router = useRouter();

const schema = yup.object({
    first_name: yup.string().required().label('First Name'),
    last_name: yup.string().required().label('Last Name'),
    email: yup.string().email().required().label('E-mail'),
    password: yup.string(),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords should match.')
        .label('Password confirmation'),
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

const route = useRoute();

onMounted(() => {
    UserService.get(parseInt(route.params.id as string))
        .then((response: any) => {
            firstName.value = response.first_name;
            lastName.value = response.last_name;
            email.value = response.email;
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
});

const submit = handleSubmit((values) => {
    const user = <UserUpdate>{ ...values };
    const id = parseInt(route.params.id as string);
    UserService.update(id, user)
        .then((response) => {
            successMessageStore.triggerSuccessMessage('User updated successfully');
            router.push({ name: 'users' });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
});
</script>