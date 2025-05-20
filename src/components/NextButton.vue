<script setup lang="ts">
import { useQuestionInfoStore } from '../store.ts'
import { storeToRefs } from 'pinia'
const store = useQuestionInfoStore()
const storeRef = storeToRefs(store)
</script>

<template>
  <button @click="storeRef.value.nextQuestion">Next</button>
</template>
