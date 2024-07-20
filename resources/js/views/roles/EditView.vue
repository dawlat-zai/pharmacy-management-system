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
                    <v-card-title class="px-8 py-4">{{ $t('roles.edit.title') }}</v-card-title>
                    <v-divider></v-divider>
                    <v-form @submit.prevent="submit">
                        <v-container class="pa-8">
                            <v-row>
                                <v-col cols="12" md="6" class="pb-2 pt-0">
                                    <CustomInputText
                                        name="name"
                                        :label="t('roles.form.labelRoleName')"
                                    ></CustomInputText>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-card-title class="pa-0">Permissions</v-card-title>
                                    <v-progress-linear v-if="permissionsLoading"></v-progress-linear>
                                </v-col>
                                <v-col cols="3" v-for="permission in permissions" :key="permission.id" class="py-0">
                                    <InputCheckbox
                                        name="permission_ids"
                                        :label="permission.name"
                                        :value="permission.id"
                                    ></InputCheckbox>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="4" class="pt-4">
                                    <v-btn type="submit" color="primary" flat rounded="lg">{{
                                        $t('buttonSave')
                                    }}</v-btn>
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
    </v-container>
</template>

<script setup lang="ts">
import RoleService from '@/client/services/RoleService';
import { useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSuccessMessageStore } from '@/store';
import { useErrorMessageStore } from '@/store/errorMessage';
import { AxiosError } from 'axios';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import CustomInputText from '@/components/form/CustomTextInput.vue';
import InputCheckbox from '@/components/InputCheckbox.vue';
import { RolePermissionInput } from '@/client/models/RolePermissionInput';
import { Role } from '@/client/models/Role';
import { Permission } from '@/client/models/Permission';
import { ref } from 'vue';
import PermissionService from '@/client/services/PermissionService';

const router = useRouter();

const { t } = useI18n();

const schema = yup.object({
    name: yup.string().required(),
});

const successMessageStore = useSuccessMessageStore();
const errorMessageStore = useErrorMessageStore();

const route = useRoute();

const { resetForm, handleSubmit } = useForm({
    validationSchema: schema,
    initialValues: <RolePermissionInput>{
        name: '',
        permission_ids: [],
    },
});

const permissions = ref<Permission[]>();
const permissionsLoading = ref(true);

onMounted(() => {
    getPermissions();
    getRole();
});

const getPermissions = () => {
    PermissionService.getAll()
        .then((response: Permission[]) => {
            permissions.value = response;
            permissionsLoading.value = false;
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
};

const getRole = () => {
    RoleService.get(parseInt(route.params.id as string))
        .then((role: Role) => {
            const form: RolePermissionInput = {
                name: role.name,
                permission_ids: role.permissions.map((permission) => permission.id),
            };
            resetForm({ values: form });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
};

const submit = handleSubmit((values) => {
    const role = <RolePermissionInput>{ ...values };
    const id = parseInt(route.params.id as string);
    RoleService.update(id, role)
        .then((role: Role) => {
            successMessageStore.triggerSuccessMessage(t('roles.edit.successMessage'));
            router.push({ name: 'roles' });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
});

const breadcrumbItems = ref([
    {
        title: 'Roles',
        disabled: false,
        to: { name: 'roles' },
    },
    {
        title: 'Edit Role',
        disabled: true,
    },
]);
</script>
