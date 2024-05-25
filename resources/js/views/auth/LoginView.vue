<template>
    <h1 class="d-flex justify-center">PMS</h1>
    <v-card class="pa-2 my-8">
        <v-card-text>
            <v-alert type="error" v-if="errorMsg" :text="errorMsg" class="mb-4" />
            <v-form @submit.prevent="login">
                <div class="my-4">
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
                </div>

                <div class="my-4">
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
                </div>

                <div class="mb-4">
                    <router-link :to="{ name: '' }" class="text-decoration-none text-primary"
                        >Forgot Password?</router-link
                    >
                </div>

                <v-btn type="submit" block color="primary" rounded="lg">Login</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import AuthService from '@/client/services/AuthService';
import UserService from '@/client/services/UserService';
import router from '@/router';
import { useAuthStore } from '../../store';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { ref } from 'vue';

const authStore = useAuthStore();

const schema = yup.object({
    email: yup.string().email().required().label('E-mail'),
    password: yup.string().required(),
});

const { defineField, handleSubmit } = useForm({
    validationSchema: schema,
});

const vuetifyConfig = (state: any) => ({
    props: {
        'error-messages': state.errors,
    },
});

const errorMsg = ref(null);

const [email, emailProps] = defineField('email', vuetifyConfig);
const [password, passwordProps] = defineField('password', vuetifyConfig);

const login = handleSubmit((values) => {
    const loginUser = { email: values.email, password: values.password };

    AuthService.login(loginUser)
        .then((response) => {
            authStore.setIsAuthenticated(true);
            UserService.getAuthUser()
                .then((user) => {
                    authStore.setUserMe(user);
                    router.push({ name: 'dashboard' });
                })
                .catch((error) => {
                    errorMsg.value = error.response.data.message;
                });
        })
        .catch((error) => {
            errorMsg.value = error.response.data.message;
        });
});
</script>
