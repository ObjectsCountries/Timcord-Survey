import { ref } from 'vue'
import { defineStore } from 'pinia'
import surveyQuestions from '../assets/questions.json'

export const useQuestionInfoStore = defineStore('questionInfo', () => {
  const currentDestination = ref(null)
  const questionsAnswered = ref(0)
  const debug = ref('questions')
  const currentQuestion = ref(JSON.parse(JSON.stringify(surveyQuestions[debug.value][0])))
  const currentResponse = ref(null)
  const buttonPressed = ref(false)
  const answers = ref([])

  function setUpUnitTests() {
    debug.value = 'debug_questions'
    currentQuestion.value = JSON.parse(JSON.stringify(surveyQuestions[debug.value][0]))
  }

  function previousQuestion() {
    currentQuestion.value.response = currentResponse.value
    answers.value[questionsAnswered.value] = JSON.parse(JSON.stringify(currentQuestion.value))
    questionsAnswered.value--
    currentQuestion.value = JSON.parse(JSON.stringify(answers.value[questionsAnswered.value]))
    currentDestination.value = currentQuestion.value.destination
    currentResponse.value = currentQuestion.value.response
    buttonPressed.value = true
    buttonPressed.value = false
  }

  function nextQuestion() {
    if (currentQuestion.value.question_type === 'multiple_choice') {
      currentQuestion.value.destination = currentResponse.value
    }
    if (currentResponse.value === currentQuestion.value.response) {
      answers.value[questionsAnswered.value] = JSON.parse(JSON.stringify(currentQuestion.value))
      currentDestination.value = currentQuestion.value.destination
      currentQuestion.value = JSON.parse(
        JSON.stringify(
          answers.value.length > questionsAnswered.value + 1
            ? answers.value[questionsAnswered.value + 1]
            : surveyQuestions[debug.value].find((x) => x.id === currentDestination.value),
        ),
      )
    } else {
      currentQuestion.value.response = currentResponse.value
      answers.value[questionsAnswered.value] = JSON.parse(JSON.stringify(currentQuestion.value))
      if (currentQuestion.value.question_type === 'multiple_choice') {
        currentDestination.value = currentQuestion.value.answers.find(
          (x) => x.id === currentResponse.value,
        ).destination
      } else {
        currentDestination.value = currentQuestion.value.destination
      }
      currentQuestion.value = JSON.parse(
        JSON.stringify(surveyQuestions[debug.value].find((x) => x.id === currentDestination.value)),
      )
    }

    for (const sub of currentQuestion.value.substitutions) {
      const replacement =
        surveyQuestions.substitutions[sub][
          Math.floor(Math.random() * surveyQuestions.substitutions[sub].length)
        ]
      currentQuestion.value.title = currentQuestion.value.title.replace(sub, replacement)
      for (const answer of currentQuestion.value.answers) {
        answer.text = answer.text.replace(sub, replacement)
      }
    }

    if (answers.value.length > questionsAnswered.value + 1) {
      const questionLocation = answers.value.find(x => x.id == currentQuestion.value.id)
      currentResponse.value = questionLocation === undefined ? null : questionLocation.response
    }
    else {
      currentResponse.value = null
    }

    questionsAnswered.value++
    buttonPressed.value = true
    buttonPressed.value = false
  }

  return {
    currentDestination,
    questionsAnswered,
    debug,
    currentQuestion,
    currentResponse,
    buttonPressed,
    answers,
    setUpUnitTests,
    previousQuestion,
    nextQuestion,
  }
})
