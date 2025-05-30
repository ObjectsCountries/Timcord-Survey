<script setup lang="ts">
import { useQuestionInfoStore } from '../stores/store.ts'
const store = useQuestionInfoStore()
import { QuestionType } from './question.ts'
import type { MultipleChoiceAnswer } from './question.ts'
</script>

<template>
  <div v-if="store.currentQuestion.question_type === QuestionType.multiple_choice">
    <FormKit
      v-model="store.currentResponse as MultipleChoiceAnswer"
      type="radio"
      :label="store.currentQuestion.title"
      :options="
        store.currentQuestion.answers.map((o: MultipleChoiceAnswer) => {
          return {
            label: o.text,
            value: o,
          }
        })
      "
      :checked="store.currentResponse ?? false"
    />
  </div>

  <div v-else-if="store.currentQuestion.question_type === QuestionType.written_response">
    <h1>amogus</h1>
  </div>

  <div v-else>
    <h1>j</h1>
  </div>

  <FormKit
    type="button"
    @click="store.previousQuestion"
    v-if="store.currentQuestion.id !== store.questionList[0].id"
    >Previous</FormKit
  >
  <FormKit
    type="button"
    @click="store.nextQuestion"
    :disabled="!store.currentResponse"
    v-if="store.currentQuestion.id !== store.questionList[store.questionList.length - 1].id"
    >Next</FormKit
  >
</template>
