import { ref } from 'vue'
import { defineStore } from 'pinia'
import surveyQuestions from '../assets/questions.json'

export const useQuestionInfoStore = defineStore('questionInfo', () => {
  const currentIndex = ref(0)
  const questionsAnswered = ref(0)
  const debug = ref("questions")
  const currentQuestion = ref(JSON.parse(JSON.stringify(surveyQuestions[debug.value][0])))
  const currentAnswer = ref(null)
  const buttonPressed = ref(false)
  const answers = ref([])

  function setUpUnitTests() {
    debug.value = "debug_questions"
    currentQuestion.value = (JSON.parse(JSON.stringify(surveyQuestions[debug.value][0])))
  }

  function newQuestion() {
    answers.value[questionsAnswered.value] = JSON.parse(JSON.stringify(currentQuestion.value))
    if (currentAnswer.value !== 'donut_loop_no') {
      currentIndex.value++
    }
    currentQuestion.value = JSON.parse(
      JSON.stringify(surveyQuestions[debug.value][currentIndex.value]),
    )

    currentAnswer.value = null

    for (const sub of currentQuestion.value.substitutions) {
      const replacement =
        surveyQuestions.substitutions[sub][Math.floor(Math.random() * surveyQuestions.substitutions[sub].length)]
      currentQuestion.value.title = currentQuestion.value.title.replace(sub, replacement)
      for (const ansID of Object.keys(currentQuestion.value.question.answers)) {
        currentQuestion.value.question.answers[ansID] = currentQuestion.value.question.answers[
          ansID
        ].replace(sub, replacement)
      }
    }
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
    currentQuestion.value.index = questionsAnswered.value
    currentQuestion.value.question.response = currentAnswer.value
    let donutAnswerChanged = false
    if (answers.value.length > questionsAnswered.value + 1) {
      if (currentAnswer.value !== answers.value[questionsAnswered.value].question.response) {
        donutAnswerChanged = true
        if (currentAnswer.value === 'donut_loop_no' || currentAnswer.value === 'donut_loop_yes') {
          newQuestion()
        } else {
          donutAnswerChanged = false
        }
      }
      if (!donutAnswerChanged) {
        answers.value[questionsAnswered.value] = JSON.parse(JSON.stringify(currentQuestion.value))
        currentQuestion.value = JSON.parse(
          JSON.stringify(answers.value[questionsAnswered.value + 1]),
        )
        currentAnswer.value = currentQuestion.value.question.response
        currentIndex.value = surveyQuestions[debug.value].findIndex(
          (x) => x.id === currentQuestion.value.id,
        )
      }
    } else {
      newQuestion()
    }

    console.log(answers.value)

    questionsAnswered.value++

    buttonPressed.value = true
    buttonPressed.value = false
  }

  return {
    currentIndex,
    questionsAnswered,
    currentQuestion,
    currentAnswer,
    buttonPressed,
    answers,
    setUpUnitTests,
    previousQuestion,
    nextQuestion,
  }
})
