<script setup lang="ts">
import { useQuestionInfoStore } from '../stores/store.ts'
const store = useQuestionInfoStore()
import { QuestionType, QuestionList } from './question.ts'
import type { MultipleChoiceAnswer } from './question.ts'
</script>

<template>
  <div v-if="store.currentQuestion.question_type === QuestionType.multiple_choice">
    <FormKit
      v-model="store.currentResponse as MultipleChoiceAnswer"
      type="radio"
      :label="store.currentQuestion.title"
      :options="
        (store.currentQuestion.answers ?? []).map((o: MultipleChoiceAnswer) => {
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
    <FormKit
      v-model="store.currentResponse as string"
      type="textarea"
      :label="store.currentQuestion.title"
      :help="`${store.currentResponse ? (store.currentResponse as string).length : 0} / ${store.currentQuestion.character_limit}`"
      :validation="`length:1,store.currentQuestion.character_limit`"
      validation-visibility="live"
      :validation-messages="{
        length: `Answer cannot be more than ${store.currentQuestion.character_limit} characters.`,
      }"
    />
  </div>

  <div v-else-if="store.currentQuestion.question_type === QuestionType.end">
    <h1>Finished!</h1>
    <FormKit type="button" @click="() => {}">Submit</FormKit>
  </div>

  <div v-else-if="store.currentQuestion.question_type === QuestionType.end_with_lap2">
    <h1>Finished!</h1>
    <FormKit type="button" @click="() => {}">Submit</FormKit>
    <FormKit
      type="button"
      @click="
        () => {
          store.restart(QuestionList.LAP2_questions)
        }
      "
    >
      Lap 2
    </FormKit>
  </div>

  <div v-else-if="store.currentQuestion.question_type === QuestionType.intro">
    <h1>{{ store.currentQuestion.title }}</h1>
  </div>

  <div v-else>
    <h1>UNDER CONSTRUCTION</h1>
  </div>

  <FormKit
    type="button"
    @click="store.previousQuestion"
    v-if="
      store.currentQuestion.id !== store.questionList[0].id &&
      ![QuestionType.intro, QuestionType.end, QuestionType.other].includes(
        store.currentQuestion.question_type,
      )
    "
    >Previous</FormKit
  >
  <FormKit
    type="button"
    @click="store.nextQuestion"
    :disabled="
      store.currentQuestion.question_type === QuestionType.written_response
        ? ((store.currentResponse as string) ?? '').length < 1 ||
          ((store.currentResponse as string) ?? '').length >
            (store.currentQuestion.character_limit ?? 100)
        : !store.currentResponse
    "
    v-if="
      store.currentQuestion.id !== store.questionList[store.questionList.length - 1].id &&
      ![QuestionType.intro, QuestionType.end, QuestionType.other].includes(
        store.currentQuestion.question_type,
      )
    "
    >Next</FormKit
  >
  <FormKit
    type="button"
    @click="store.nextQuestion"
    v-if="store.currentQuestion.question_type === QuestionType.intro"
    >Begin</FormKit
  >
</template>
