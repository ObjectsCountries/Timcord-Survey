<script setup lang="ts">
import SurveyQuestion from './components/SurveyQuestion.vue'
import { useQuestionInfoStore } from './stores/store.ts'
const store = useQuestionInfoStore()
</script>

<template>
  <SurveyQuestion :key="store.buttonPressed" />
</template>
