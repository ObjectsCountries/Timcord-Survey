<script setup lang="ts">
import { useQuestionInfoStore } from '../stores/store.ts'
const store = useQuestionInfoStore()
import surveyQuestions from '../assets/questions.json'
</script>

<template>
  <div v-if="store.currentQuestion.question.type === 'multiple_choice'">
    <FormKit
      v-model="store.currentAnswer"
      type="radio"
      :label="store.currentQuestion.title"
      :options="store.currentQuestion.question.answers"
      :checked="store.currentAnswer ?? false"
    />
  </div>

  <div v-else-if="store.currentQuestion.question.type === 'written_response'">
    <h1>amogus</h1>
  </div>

  <div v-else>
    <h1>j</h1>
  </div>

  <FormKit type="button" @click="store.previousQuestion" v-if="store.currentIndex > 0"
    >Previous</FormKit
  >
  <FormKit
    type="button"
    @click="store.nextQuestion"
    :disabled="store.currentAnswer ?? true"
    v-if="store.currentIndex < surveyQuestions.questions.length - 1"
    >Next</FormKit
  >
</template>
