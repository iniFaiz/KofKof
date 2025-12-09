<script setup>
import { ref, onUnmounted, nextTick } from "vue";
import axios from "axios";
import PopUpPage from "./PopUpPage.vue";

const isRecording = ref(false);
const canvasRef = ref(null);
const recordingTime = ref(10);
const showCoughAnalysisPopup = ref(false);
const analysisResult = ref(null);
const analysisError = ref(null);
const API_URL = "https://razi404-kofkof-api.hf.space";

let audioContext = null;
let analyser = null;
let microphone = null;
let animationId = null;
let mediaStream = null;
let silenceTimeout = null;
let recordingTimer = null;
let mediaRecorder = null;
let audioChunks = [];
let lastSoundTime = Date.now();

const SILENCE_THRESHOLD = 10; // Minimum audio level to detect sound
const SILENCE_DURATION = 5000; // 5 seconds of silence
const MAX_RECORDING_TIME = 10; // 10 seconds maximum recording time

const startRecording = async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(mediaStream);

    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.8;
    microphone.connect(analyser);

    // Setup MediaRecorder
    audioChunks = [];
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    mediaRecorder.onstop = sendAudioToBackend;
    mediaRecorder.start();

    isRecording.value = true;
    recordingTime.value = MAX_RECORDING_TIME;
    lastSoundTime = Date.now();

    recordingTimer = setInterval(() => {
      recordingTime.value--;
      if (recordingTime.value <= 0) {
        stopRecording();
      }
    }, 1000);

    await nextTick();
    visualize();
  } catch (err) {
    console.error("Error accessing microphone:", err);
    alert("Please allow microphone access to use this feature");
  }
};

const stopRecording = () => {
  if (!isRecording.value) return;
  
  isRecording.value = false;

  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }

  if (animationId) cancelAnimationFrame(animationId);
  if (recordingTimer) clearInterval(recordingTimer);
  if (silenceTimeout) clearTimeout(silenceTimeout);
  if (microphone) microphone.disconnect();
  if (audioContext) audioContext.close();
  if (mediaStream) mediaStream.getTracks().forEach((track) => track.stop());

  if (canvasRef.value) {
    const canvas = canvasRef.value;
    const canvasCtx = canvas.getContext("2d");
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  // Show popup in loading state
  analysisResult.value = null;
  analysisError.value = null;
  showCoughAnalysisPopup.value = true;
};

const sendAudioToBackend = async () => {
  // Coba rekam sebagai WAV, jika tidak bisa, biarkan default browser
  const mimeType = MediaRecorder.isTypeSupported('audio/wav; codecs=opus') 
    ? 'audio/wav; codecs=opus' 
    : 'audio/webm';
  const audioBlob = new Blob(audioChunks, { type: mimeType });
  const formData = new FormData();
  formData.append("file", audioBlob, "cough.wav");

  try {
    const response = await axios.post(`${API_URL}/predict`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    analysisResult.value = response.data;
    analysisError.value = null; // Pastikan error di-reset jika berhasil
  } catch (error) {
    console.error("Error sending audio to backend:", error);
    if (error.response) {
      // Server merespons dengan status error (4xx, 5xx)
      console.error("Backend Response Data:", error.response.data);
      analysisError.value = `Backend error: ${error.response.data.error || 'Unknown error'}`;
    } else if (error.request) {
      // Request dibuat tapi tidak ada respons (masalah jaringan, CORS)
      console.error("No response received:", error.request);
      analysisError.value = "Could not connect to the server. Please check your network and CORS settings.";
    } else {
      // Error lain saat setup request
      console.error("Error setting up request:", error.message);
      analysisError.value = "An unexpected error occurred. Please try again.";
    }
  }
};

const closePopup = () => {
  showCoughAnalysisPopup.value = false;
  analysisResult.value = null;
  analysisError.value = null;
};

const checkForSilence = (dataArray) => {
  const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

  if (average > SILENCE_THRESHOLD) {
    lastSoundTime = Date.now();
    if (silenceTimeout) {
      clearTimeout(silenceTimeout);
      silenceTimeout = null;
    }
  } else {
    const silenceDuration = Date.now() - lastSoundTime;
    if (silenceDuration >= SILENCE_DURATION && !silenceTimeout) {
      console.log("5 seconds of silence detected, stopping recording");
      stopRecording();
    }
  }
};

const visualize = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const canvasCtx = canvas.getContext("2d");
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const draw = () => {
    if (!isRecording.value) return;
    animationId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    checkForSilence(dataArray);

    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
      canvasCtx.fillStyle = "#3b82f6";
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
      x += barWidth;
    }
  };

  draw();
};

const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

onUnmounted(() => {
  stopRecording();
});
</script>

<template>
  <link rel="stylesheet" href="../assets/main.css" />
  <div class="container">
    <div class="main">
      <div class="container01">
        <div class="wrapper">
          <div class="logo01">
            <img
              src="../components/icons/logo.png"
              alt="logo"
              class="mt-10 mb-5"
            />
          </div>
          <h1>Your cough says a lot about your health.</h1>
          <p>
            This tool analyzes the acoustic signature of your cough to help
            identify its type (e.g., dry, wet, productive). It is designed to
            help you understand your symptoms and better describe them to a
            healthcare professional. For an accurate reading, please cough
            clearly into your microphone for 10 seconds. The entire test is done
            on your device for your privacy; we do not store any recordings or
            results.
          </p>
        </div>
      </div>
      <div class="h-12"></div>

      <!-- Audio Visualizer Canvas -->
      <div v-if="isRecording" class="mx-auto mb-6" style="max-width: 700px">
        <canvas
          ref="canvasRef"
          width="700"
          height="100"
          class="w-full border border-gray-300 rounded"
        ></canvas>
        <p class="mt-2 text-lg text-center text-gray-600">Listening... ({{ recordingTime }}s left)</p>
      </div>

      <button
        v-if="!isRecording"
        @click="toggleRecording"
        class="block py-3 mx-auto text-2xl text-white bg-blue-500 rounded px-7 hover:bg-blue-700"
      >
        Begin Test
      </button>
       <button
        v-else
        @click="toggleRecording"
        class="block py-3 mx-auto text-2xl text-white bg-red-500 rounded px-7 hover:bg-red-700"
      >
        Stop Test
      </button>

      <div class="container02">
        <h2 class="mt-40 mb-4 text-2xl font-bold">FAQ</h2>

        <div class="wrapper">
          <p>
            <strong>What is this tool?</strong> This tool analyzes the acoustic
            signature of your cough to help identify its type (e.g., dry, wet,
            productive). It is designed to help you understand your symptoms and
            better describe them to a healthcare professional.
          </p>
          <p>
            <strong>What is a 'cough signature'?</strong> A cough signature is 
            the unique acoustic profile of your cough. Different conditions 
            can produce distinct sounds (e.g., a dry, hacking cough sounds different 
            from a deep, wet cough). My app analyzes this signature to help identify 
            its characteristics.
          </p>
          <p>
            <strong>How does it work?</strong> The tool uses your device's
            microphone to record your cough for 10 seconds. It then analyzes the
            sound to determine the type of cough based on its acoustic features.
          </p>
          <p>
            <strong>Is this a medical diagnosis?</strong> No. Absolutely not. This tool 
            is for informational and educational purposes only. It is not a substitute 
            for professional medical advice from a doctor or other qualified healthcare provider.
          </p>
          <p>
            <strong>Is my data private?</strong> Yes, all processing is done on
            your device. We do not store any recordings or results.
          </p>
        </div>
      </div>
      <!-- From Uiverse.io by aguerquin -->
      <a href="https://github.com/iniFaiz/KofKof" target="_blank" rel="noopener noreferrer" class="inline-block">
        <div class="mt-20 mb-20 button-icon">
          <div class="icon">
            <svg viewBox="0 0 24 24">
              <path
                d="M12 0.296997C5.37 0.296997 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.424 9.025 23.105C9.025 22.82 9.015 22.065 9.01 21.065C5.672 21.789 4.968 19.455 4.968 19.455C4.422 18.07 3.633 17.7 3.633 17.7C2.546 16.956 3.717 16.971 3.717 16.971C4.922 17.055 5.555 18.207 5.555 18.207C6.625 20.042 8.364 19.512 9.05 19.205C9.158 18.429 9.467 17.9 9.81 17.6C7.145 17.3 4.344 16.268 4.344 11.67C4.344 10.36 4.809 9.29 5.579 8.45C5.444 8.147 5.039 6.927 5.684 5.274C5.684 5.274 6.689 4.952 8.984 6.504C9.944 6.237 10.964 6.105 11.984 6.099C13.004 6.105 14.024 6.237 14.984 6.504C17.264 4.952 18.269 5.274 18.269 5.274C18.914 6.927 18.509 8.147 18.389 8.45C19.154 9.29 19.619 10.36 19.619 11.67C19.619 16.28 16.814 17.295 14.144 17.59C14.564 17.95 14.954 18.686 14.954 19.81C14.954 21.416 14.939 22.706 14.939 23.096C14.939 23.411 15.149 23.786 15.764 23.666C20.565 22.092 24 17.592 24 12.297C24 5.67 18.627 0.296997 12 0.296997Z"
                fill="#222229"
              ></path>
            </svg>
          </div>
          <div class="cube">
            <span class="side front">hover me</span>
            <span class="side top">check it on github</span>
          </div>
        </div>
      </a>
    </div>
  </div>
  <PopUpPage 
    :show="showCoughAnalysisPopup" 
    :result="analysisResult"
    :error="analysisError"
    @close="closePopup" 
  />
</template>

<style></style>
