<script setup lang="ts">
import { useQuestionInfoStore } from '../stores/store.ts'
const store = useQuestionInfoStore()
import surveyQuestions from '../assets/questions.json'
</script>

<template>
  <div v-if="store.currentQuestion.question_type === 'multiple_choice'">
    <FormKit
      v-model="store.currentResponse"
      type="radio"
      :label="store.currentQuestion.title"
      :options="
        Object.fromEntries(
          store.currentQuestion.answers.map(function (o) {
            return [o.id, o.text]
          }),
        )
      "
      :checked="store.currentResponse ?? false"
    />
  </div>

  <div v-else-if="store.currentQuestion.question_type === 'written_response'">
    <h1>amogus</h1>
  </div>

  <div v-else>
    <h1>j</h1>
  </div>

  <FormKit
    type="button"
    @click="store.previousQuestion"
    v-if="store.currentQuestion.id !== surveyQuestions[store.debug][0].id"
    >Previous</FormKit
  >
  <FormKit
    type="button"
    @click="store.nextQuestion"
    :disabled="!store.currentResponse"
    v-if="
      store.currentQuestion.id !==
      surveyQuestions[store.debug][surveyQuestions[store.debug].length - 1].id
    "
    >Next</FormKit
  >
</template>
