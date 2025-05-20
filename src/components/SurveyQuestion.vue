<script setup lang="ts">
import NextButton from './NextButton.vue'
import { useQuestionInfoStore } from '../store.ts'
import { storeToRefs } from 'pinia'
const store = useQuestionInfoStore()
const storeRef = storeToRefs(store)
import surveyQuestions from '../assets/questions.json'
const chosenQuestion = surveyQuestions.questions[store.currentQuestion]
for (const sub of chosenQuestion.substitutions) {
    const replacement = surveyQuestions[sub][Math.floor(Math.random()*surveyQuestions[sub].length)]
    chosenQuestion.title = chosenQuestion.title.replace(sub, replacement)
    for (const ansID of Object.keys(chosenQuestion.question.answers)) {
      chosenQuestion.question.answers[ansID] = chosenQuestion.question.answers[ansID].replace(sub, replacement)
    }
}

</script>

<template>
<h3>{{ chosenQuestion.title }}</h3>

  <div v-if="chosenQuestion.question.type === 'multiple_choice'">
    <div
      v-for="[id, text] in Object.entries(chosenQuestion.question.answers)"
      :key="id"
    >
      <input type="radio" id="{{ id }}" :value="id" v-model="storeRef.value.currentAnswer.question.response" />
      <label for="{{ id }}">{{ text }}</label>
    </div>
  </div>

  <div v-else-if="chosenQuestion.question.type === 'written_response'">
    <h1>amogus</h1>
  </div>

  <div v-else>
    <h1>j</h1>
  </div>

  <NextButton/>
</template>
