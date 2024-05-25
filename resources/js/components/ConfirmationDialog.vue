<template>
    <v-dialog v-model="visible" max-width="500px" persistent>
      <v-card rounded="lg">
        <v-card-title class="mt-2 ml-2">{{ title }}</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" rounded="lg"text @click="cancel">Cancel</v-btn>
          <v-btn color="red darken-1" rounded="lg" text @click="confirm">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  
  // Define props for title, message, and visibility
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  });
  
  // Define emits for confirm and cancel actions
  const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);
  
  // Local state to control dialog visibility
  const visible = ref(props.modelValue);
  
  // Watch for changes in modelValue to sync local state
  watch(() => props.modelValue, (newValue) => {
    visible.value = newValue;
  });
  
  // Methods to handle confirm and cancel actions
  const confirm = () => {
    emit('confirm');
    visible.value = false;
    emit('update:modelValue', false);
  };
  
  const cancel = () => {
    emit('cancel');
    visible.value = false;
    emit('update:modelValue', false);
  };
  
  // Watch for changes in local state to sync back to modelValue
  watch(visible, (newValue) => {
    emit('update:modelValue', newValue);
  });
  </script>
  