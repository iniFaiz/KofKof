<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5);">
    <div class="w-11/12 max-w-md p-6 text-center shadow-xl bg-gray-50 rounded-2xl md:p-8">
      
      <!-- Loading State -->
      <div v-if="!result && !error">
        <h2 class="mb-4 text-2xl font-bold text-gray-800">Analyzing...</h2>
        <div class="w-16 h-16 mx-auto border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600">Please wait while we analyze your cough.</p>
      </div>

      <!-- Error State -->
      <div v-if="error">
        <div class="flex flex-col items-center">
          <svg class="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 class="mt-4 mb-2 text-2xl font-bold text-red-600">Analysis Failed</h2>
          <p class="text-gray-600">{{ error }}</p>
          <button @click="closePopup" class="w-full px-4 py-3 mt-6 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
            Close
          </button>
        </div>
      </div>

      <!-- Result State -->
      <div v-if="result">
        <h2 class="mb-5 text-2xl font-bold text-gray-800">Analysis Results</h2>
        
        <div class="p-6 rounded-lg" :class="coughType === 'Dry' || coughType === 'Wet' ? 'bg-orange-100' : 'bg-red-100'">
          <div class="flex items-center justify-start">
            <!-- Icon for cough type -->
            <div v-if="coughType === 'Dry' || coughType === 'Wet'" class="flex-shrink-0 mr-4">
              <svg class="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
            </div>
            <div v-if="coughType === 'Unknown'" class="flex-shrink-0 mr-4">
              <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            
            <div>
              <p class="text-sm text-left text-gray-600">Your Cough Type</p>
              <p class="text-3xl font-bold text-left" :class="coughType === 'Dry' || coughType === 'Wet' ? 'text-orange-600' : 'text-red-600'">
                {{ coughType }}
              </p>
            </div>
          </div>
          <div class="mt-4 text-left">
             <p class="text-sm text-gray-600">Confidence Level: <span class="font-bold" :class="coughType === 'Dry' || coughType === 'Wet' ? 'text-orange-600' : 'text-red-600'">{{ confidenceLevel }}%</span></p>
          </div>
        </div>

        <div class="mt-6 text-left">
          <p class="text-gray-700">{{ coughDescription }}</p>
        </div>

        <div class="mt-6 text-left">
          <h3 class="mb-3 text-lg font-semibold text-gray-800">What You Can Try:</h3>
          <ul class="space-y-2">
            <li v-for="tip in tips" :key="tip" class="flex items-start">
              <svg class="flex-shrink-0 w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              <span class="text-gray-700">{{ tip }}</span>
            </li>
          </ul>
        </div>
        
        <button @click="closePopup" class="w-full px-4 py-3 mt-8 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopUpPage',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    result: {
      type: Object,
      default: null,
    },
    error: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      coughType: '', // 'Dry' or 'Wet'
      coughDescription: '',
      tips: [],
      confidenceLevel: 0,
    };
  },
  methods: {
    processResults() {
      if (!this.result) return;

      // Map backend prediction to frontend display
      if (this.result.prediction === 'dry') {
        this.coughType = 'Dry';
      } else if (this.result.prediction === 'wet') {
        this.coughType = 'Wet';
      } else {
        this.coughType = 'Unknown'; // Handle non-cough or other cases
      }

      this.confidenceLevel = parseFloat(this.result.confidence).toFixed(2);

      if (this.coughType === 'Dry') {
        this.coughDescription = 'A dry cough does not produce phlegm or mucus. It usually feels like a tickle in your throat.';
        this.tips = ['Drink warm water with honey.', 'Use a humidifier.', 'Avoid irritants like cigarette smoke.'];
      } else if (this.coughType === 'Wet') {
        this.coughDescription = 'A wet or productive cough produces phlegm or mucus from the lungs.';
        this.tips = ['Drink plenty of fluids to thin the mucus.', 'Use an expectorant if necessary.', 'Get enough rest.'];
      } else {
        this.coughDescription = 'The sound could not be identified as a clear cough. Please try again.';
        this.tips = ['Ensure you are in a quiet environment.', 'Cough clearly and directly into the microphone.'];
      }
    },
    closePopup() {
      this.$emit('close');
    },
  },
  watch: {
    result: {
      handler(newResult) {
        if (newResult) {
          this.processResults();
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
/* Additional styling if needed */
</style>
