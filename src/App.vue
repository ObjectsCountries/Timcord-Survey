<script setup lang="ts">
import SurveyQuestion from './components/SurveyQuestion.vue'
import { useQuestionInfoStore } from './store.ts'
import { storeToRefs } from 'pinia'
const store = useQuestionInfoStore()
const storeRef = storeToRefs(store)
</script>

<template>
  <SurveyQuestion :key="storeRef"/>
</template>
