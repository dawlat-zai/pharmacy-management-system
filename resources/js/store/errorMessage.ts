import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useErrorMessageStore = defineStore('errorMessage', () => {
  const showErrorMessage = ref(false);
  const message = ref('');

  function triggerErrorMessage(error: AxiosError) {
    let data:any = error.response?.data;

    message.value = data.message;

    showErrorMessage.value = true;
    
    setTimeout(() => {
      showErrorMessage.value = false;
    }, 5000);
  }

  return {
    showErrorMessage,
    message,
    triggerErrorMessage,
  };
});
