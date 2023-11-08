<template>
  <v-app>
    <v-main>
      <v-container class="fill-height bg-grey-lighten-3" fluid>
        <v-row class="justify-center">
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
            <h1 class="d-flex justify-center">PMS</h1>
            <v-card class="pa-2 my-8">
              <v-card-text>
                <v-form>
                  <v-text-field label="Email" variant="underlined" color="primary"></v-text-field>

                  <v-text-field type="password" label="Password" variant="underlined" color="primary"></v-text-field>

                  <div class="mb-4">
                    <router-link :to="{ name: '' }" class="text-decoration-none text-primary"
                      >Forgot Password?</router-link
                    >
                  </div>

                  <v-btn block color="primary" size="large">Login</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts"></script>
