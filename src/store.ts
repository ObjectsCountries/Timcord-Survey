import { ref } from 'vue'
import { defineStore } from 'pinia'
import surveyQuestions from './assets/questions.json'

export const useQuestionInfoStore = defineStore('questionInfo', () => {
  const currentQuestion = ref(0)
  const questionsAnswered = ref(0)
  const currentAnswer = ref(JSON.parse(JSON.stringify(surveyQuestions.questions[0])))
  const currentResponse = ref(null)
  const buttonPressed = ref(false)
  const answers = ref([])

  function previousQuestion() {
    answers.value[questionsAnswered.value] = JSON.parse(JSON.stringify(currentAnswer.value))
    questionsAnswered.value--
    currentAnswer.value = JSON.parse(JSON.stringify(answers.value[questionsAnswered.value]))
    currentResponse.value = currentAnswer.value.question.response
    buttonPressed.value = true
    buttonPressed.value = false
  }

  function nextQuestion() {
    currentAnswer.value.index = questionsAnswered.value
    currentAnswer.value.question.response = currentResponse.value
    if (answers.value.length > questionsAnswered.value + 1) {
      answers.value[questionsAnswered.value] = JSON.parse(JSON.stringify(currentAnswer.value))
      currentAnswer.value = JSON.parse(JSON.stringify(answers.value[questionsAnswered.value + 1]))
      currentResponse.value = currentAnswer.value.question.response
    } else {
      answers.value[questionsAnswered.value] = JSON.parse(JSON.stringify(currentAnswer.value))
      if (currentResponse.value !== 'donut_loop_no') {
        currentQuestion.value++
      }
      currentAnswer.value = JSON.parse(
        JSON.stringify(surveyQuestions.questions[currentQuestion.value]),
      )

      currentResponse.value = null

      for (const sub of currentAnswer.value.substitutions) {
        const replacement =
          surveyQuestions[sub][Math.floor(Math.random() * surveyQuestions[sub].length)]
        currentAnswer.value.title = currentAnswer.value.title.replace(sub, replacement)
        for (const ansID of Object.keys(currentAnswer.value.question.answers)) {
          currentAnswer.value.question.answers[ansID] = currentAnswer.value.question.answers[
            ansID
          ].replace(sub, replacement)
        }
      }

    }

    questionsAnswered.value++

    buttonPressed.value = true
    buttonPressed.value = false

  }

  return {
    currentQuestion,
    currentAnswer,
    currentResponse,
    buttonPressed,
    answers,
    previousQuestion,
    nextQuestion,
  }
})
