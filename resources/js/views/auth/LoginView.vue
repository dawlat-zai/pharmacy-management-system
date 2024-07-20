<template>
    <h1 class="d-flex justify-center py-8">PMS</h1>
    <v-card class="pa-4 mx-auto" style="max-width: 450px;" rounded="lg">
        <v-card-text class="d-flex justify-center" style="font-size: 1.1rem">Sign in with</v-card-text>
        <v-card-text>
            <v-alert type="error" v-if="errorMsg" :text="errorMsg" variant="tonal" class="mb-4" />
            <v-form @submit.prevent="login">
                <div class="my-4">
                    <CustomInputText name="email" label="Email"></CustomInputText>
                </div>

                <div class="my-4">
                    <CustomInputText type="password" name="password" label="Password"></CustomInputText>
                </div>

                <div class="mb-4">
                    <router-link :to="{ name: '' }" class="text-decoration-none text-primary font-weight-medium"
                        >Forgot Password?</router-link
                    >
                </div>

                <v-btn type="submit" block flat color="primary" size="large" rounded="lg">Login</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { LoginUser } from '@/client/models/LoginUser';
import AuthService from '@/client/services/AuthService';
import UserService from '@/client/services/UserService';
import router from '@/router';
import CustomInputText from '@/components/form/CustomTextInput.vue';
import { useAuthStore } from '../../store';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { ref } from 'vue';

const authStore = useAuthStore();

const schema = yup.object({
    email: yup.string().email().required().label('E-mail'),
    password: yup.string().required(),
});

const { handleSubmit } = useForm({
    validationSchema: schema,
    initialValues: <LoginUser>{
        email: '',
        password: '',
    },
});

const errorMsg = ref(null);

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
