<script setup lang="ts">
import { useQuestionInfoStore } from '../store.ts'
const store = useQuestionInfoStore()
import surveyQuestions from '../assets/questions.json'
store.currentAnswer = JSON.parse(JSON.stringify(surveyQuestions.questions[store.currentQuestion]))
</script>

<template>
  <div v-if="store.currentAnswer.question.type === 'multiple_choice'">
    <FormKit
      v-model="store.currentResponse"
      type="radio"
      :label="store.currentAnswer.title"
      :options="store.currentAnswer.question.answers"
      :checked="store.currentResponse ?? false"
    />
  </div>

  <div v-else-if="store.currentAnswer.question.type === 'written_response'">
    <h1>amogus</h1>
  </div>

  <div v-else>
    <h1>j</h1>
  </div>

  <FormKit type="button" @click="store.previousQuestion">Previous</FormKit>
  <FormKit type="button" @click="store.nextQuestion">Next</FormKit>
</template>
