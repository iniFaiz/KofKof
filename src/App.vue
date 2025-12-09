<script setup>
import HomePage from './components/HomePage.vue'
import WarningPopUpPage from './components/WarningPopUpPage.vue'
</script>

<template>
  <HomePage />
  <WarningPopUpPage />
</template>

<style>
.container {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    ". Main ."
    ". Main ."
    ". Main .";
  min-height: 100vh;
  margin: 0 auto;
  max-width: 100%;
}

@media (max-width: 768px) {
  .container {
    display: block;
    padding: 20px;
  }
}

.main { 
  grid-area: Main;
}
.container01 {
  display: flex;
  text-align: justify;
  flex-direction: column;
  gap: 20px;
}
.container02 {
  display: flex;
  text-align: justify;
  flex-direction: column;
}
</style>
