<script setup lang="ts">
import { useQuestionInfoStore } from '../store.ts'
const store = useQuestionInfoStore()
import surveyQuestions from '../assets/questions.json'
store.currentAnswer = surveyQuestions.questions[store.currentQuestion]
for (const sub of store.currentAnswer.substitutions) {
    const replacement = surveyQuestions[sub][Math.floor(Math.random()*surveyQuestions[sub].length)]
    store.currentAnswer.title = store.currentAnswer.title.replace(sub, replacement)
    for (const ansID of Object.keys(store.currentAnswer.question.answers)) {
      store.currentAnswer.question.answers[ansID] = store.currentAnswer.question.answers[ansID].replace(sub, replacement)
    }
}
</script>

<template>
  <div v-if="store.currentAnswer.question.type === 'multiple_choice'">
    <FormKit
      v-model='store.currentResponse'
      type='radio'
      :label='store.currentAnswer.title'
      :options='store.currentAnswer.question.answers'
    />
  </div>

  <div v-else-if="store.currentAnswer.question.type === 'written_response'">
    <h1>amogus</h1>
  </div>

  <div v-else>
    <h1>j</h1>
  </div>

  <FormKit type="button" @click="store.nextQuestion">Next</FormKit>
</template>
