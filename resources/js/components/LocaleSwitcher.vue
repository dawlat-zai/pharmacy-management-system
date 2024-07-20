<template>
    <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon class="mx-4">
                <v-avatar style="width: 22px; height: 22px;">
                    <v-img :src="'/assets/flags/'+selectedLocale+'.svg'"></v-img>
                </v-avatar>
            </v-btn>
        </template>
        <v-card class="mx-auto" max-width="300">
            <v-list density="compact">
                <v-list-item v-for="locale in LOCALES" :key="locale.value" :value="locale" :active="selectedLocale === locale.value" color="primary">
                    <template v-slot:prepend>
                        <v-avatar style="width: 22px; height: 22px;" variant="flat">
                            <v-img :src="'/assets/flags/'+locale.value+'.svg'"></v-img>
                        </v-avatar>
                    </template>
                    <v-list-item-title v-text="locale.caption" @click="changeLocale(locale.value)"></v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocaleStore } from '@/store';
import { useLocale } from 'vuetify';
import { LOCALES } from '@/locales/locales';
import { defaultLocale } from '@/locales';
import { setYupLocale } from '@/utils/utils';
import { computed } from 'vue';

const selectedLocale = ref(defaultLocale);

const { locale } = useI18n();
const localeStore = useLocaleStore();

const { current } = useLocale();

selectedLocale.value = localeStore.locale;

const changeLocale = (value) => {
    selectedLocale.value = value;
    localeStore.setLocale(selectedLocale.value);
    locale.value = selectedLocale.value;
    current.value = selectedLocale.value;
    setYupLocale(selectedLocale.value);
};

const { t } = useI18n();

watch(
    () => localeStore.locale,
    (newLocale) => {
        selectedLocale.value = newLocale;
        locale.value = newLocale;
        current.value = selectedLocale.value;
        setYupLocale(selectedLocale.value);
    },
);
</script>

<style scoped>
.locale-select {
    width: 200px;
}
</style>
