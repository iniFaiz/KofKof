<script setup>
import { ref, onMounted } from 'vue';

const show = ref(false);

const acceptDisclaimer = () => {
  localStorage.setItem('disclaimerAccepted', 'true');
  show.value = false;
};

onMounted(() => {
  const accepted = localStorage.getItem('disclaimerAccepted');
  if (!accepted) {
    show.value = true;
  }
});
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.7);">
    <div class="w-11/12 max-w-md p-6 text-center bg-white rounded-2xl shadow-xl md:p-8">
      <div class="mb-4 text-yellow-500">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>
      <h2 class="mb-4 text-2xl font-bold text-gray-800">Disclaimer</h2>
      <p class="mb-6 text-gray-600">
        I understand that this application is not a substitute for a doctor's diagnosis. The analysis results are for informational purposes only.
      </p>
      <button 
        @click="acceptDisclaimer" 
        class="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        I Understand
      </button>
    </div>
  </div>
</template>
