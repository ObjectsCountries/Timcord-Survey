import { ref } from 'vue'
import { defineStore } from 'pinia'
import surveyQuestions from '../assets/questions.json'

export const useQuestionInfoStore = defineStore('questionInfo', () => {
  const currentIndex = ref(0)
  const questionsAnswered = ref(0)
  const debug = ref('debug_questions')
  const currentQuestion = ref(JSON.parse(JSON.stringify(surveyQuestions[debug.value][0])))
  const currentAnswer = ref(null)
  const buttonPressed = ref(false)
  const answers = ref([])

  function setUpUnitTests() {
    debug.value = 'debug_questions'
    currentQuestion.value = JSON.parse(JSON.stringify(surveyQuestions[debug.value][0]))
  }

  function previousQuestion() {
    currentQuestion.value.question.response = currentAnswer.value
    answers.value[questionsAnswered.value] = JSON.parse(JSON.stringify(currentQuestion.value))
    questionsAnswered.value--
    currentQuestion.value = JSON.parse(JSON.stringify(answers.value[questionsAnswered.value]))
    currentIndex.value = surveyQuestions[debug.value].findIndex(
      (x) => x.id === currentQuestion.value.id,
    )
    currentAnswer.value = currentQuestion.value.question.response
    buttonPressed.value = true
    buttonPressed.value = false
  }

  function nextQuestion() {
    if (currentAnswer.value === currentQuestion.value.question.response) {
      currentQuestion.value.question.response = currentAnswer.value
      answers.value[questionsAnswered.value] = JSON.parse(JSON.stringify(currentQuestion.value))
      currentIndex.value = currentQuestion.value.question.answers.find(
        (x) => x.id === currentAnswer.value,
      ).destination
      currentQuestion.value = JSON.parse(
        JSON.stringify(
          answers.value.length > questionsAnswered.value + 1
            ? answers.value[questionsAnswered.value + 1]
            : surveyQuestions[debug.value][currentIndex.value],
        ),
      )
    } else {
      currentQuestion.value.question.response = currentAnswer.value
      answers.value[questionsAnswered.value] = JSON.parse(JSON.stringify(currentQuestion.value))
      currentIndex.value = currentQuestion.value.question.answers.find(
        (x) => x.id === currentAnswer.value,
      ).destination
      currentQuestion.value = JSON.parse(
        JSON.stringify(surveyQuestions[debug.value][currentIndex.value]),
      )
    }

    for (const sub of currentQuestion.value.substitutions) {
      const replacement =
        surveyQuestions.substitutions[sub][
          Math.floor(Math.random() * surveyQuestions.substitutions[sub].length)
        ]
      currentQuestion.value.title = currentQuestion.value.title.replace(sub, replacement)
      for (const answer of currentQuestion.value.question.answers) {
        answer.text = answer.text.replace(sub, replacement)
      }
    }

    currentAnswer.value =
      answers.value.length > questionsAnswered.value + 1
        ? answers.value[questionsAnswered.value + 1].question.response
        : null

    questionsAnswered.value++
    buttonPressed.value = true
    buttonPressed.value = false
  }

  return {
    currentIndex,
    questionsAnswered,
    debug,
    currentQuestion,
    currentAnswer,
    buttonPressed,
    answers,
    setUpUnitTests,
    previousQuestion,
    nextQuestion,
  }
})
