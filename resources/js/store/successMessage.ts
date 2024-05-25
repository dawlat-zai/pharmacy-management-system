import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSuccessMessageStore = defineStore('successMessage', () => {
  const showSuccessMessage = ref(false);
  const message = ref('');

  function triggerSuccessMessage(newMessage: string) {
    message.value = newMessage;
    showSuccessMessage.value = true;
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 5000);
  }

  return {
    showSuccessMessage,
    message,
    triggerSuccessMessage,
  };
});
