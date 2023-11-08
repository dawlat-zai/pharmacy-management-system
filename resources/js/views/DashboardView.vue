<template>
  <v-card>
    <v-layout class="bg-grey-lighten-3">
      <v-navigation-drawer permanent class="bg-primary">
        <template #prepend>
          <v-list-item
            lines="two"
            prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg"
            title="Jane Smith"
            subtitle="Logged in"
          ></v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home-city" title="Dashboard" value="dashboard"></v-list-item>
          <v-list-item prepend-icon="mdi-account" title="Users" value="users"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar :elevation="0" class="px-8">
        <h1>Pharmacy Management System</h1>
      </v-app-bar>

      <v-main class="ma-8" style="height: calc(100vh - 64px)">
        <h1>Dashboard</h1>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup lang="ts"></script>
