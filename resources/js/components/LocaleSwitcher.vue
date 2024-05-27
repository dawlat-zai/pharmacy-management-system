<template>
    <v-row justify="end">
        <v-col cols="auto">
            <v-select
                :items="LOCALES"
                item-value="value"
                item-title="caption"
                v-model="selectedLocale"
                :label="t('localeSwitcher.labelSelectLanguage')"
                @update:modelValue="changeLocale"
                variant="outlined"
                density="compact"
                rounded="lg"
                class="locale-select"
            ></v-select>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocaleStore } from '@/store';
import { useLocale } from 'vuetify';
import { LOCALES } from '@/locales/locales';
import { defaultLocale } from '@/locales';
import { setYupLocale } from '@/utils/utils';

const selectedLocale = ref(defaultLocale);

const { locale } = useI18n();
const localeStore = useLocaleStore();

const { current } = useLocale();

selectedLocale.value = localeStore.locale;

const changeLocale = () => {
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
