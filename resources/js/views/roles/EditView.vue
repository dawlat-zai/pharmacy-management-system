<template>
    <v-row>
        <v-col cols="12" md="8">
            <v-card :title="t('roles.edit.title')" rounded="lg">
                <v-form @submit.prevent="submit">
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="4" class="pb-2 pt-0">
                                <v-text-field
                                    :label="t('roles.form.labelName')"
                                    v-model="name"
                                    v-bind="nameProps"
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
import { RoleUpdate } from '@/client/models/RoleUpdate';
import RoleService from '@/client/services/RoleService';
import { useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
import { useSuccessMessageStore } from '@/store';
import { useErrorMessageStore } from '@/store/errorMessage';
import { AxiosError } from 'axios';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const router = useRouter();

const { t } = useI18n();

const schema = yup.object({
    name: yup.string().required(),
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

const [name, nameProps] = defineField('name', vuetifyConfig);

const route = useRoute();

onMounted(() => {
    RoleService.get(parseInt(route.params.id as string))
        .then((response: any) => {
            name.value = response.name;
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
});

const submit = handleSubmit((values) => {
    const role = <RoleUpdate>{ ...values };
    const id = parseInt(route.params.id as string);
    RoleService.update(id, role)
        .then((response) => {
            successMessageStore.triggerSuccessMessage(t('roles.edit.successMessage'));
            router.push({ name: 'roles' });
        })
        .catch((error: AxiosError) => {
            errorMessageStore.triggerErrorMessage(error);
        });
});
</script>
