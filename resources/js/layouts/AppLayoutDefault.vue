<template>
    <v-app>
        <v-main>
            <v-container class="fill-height bg-grey-lighten-3" fluid>
                <v-row class="justify-center">
                    <v-col cols="12">
                        <slot />
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts"></script>
