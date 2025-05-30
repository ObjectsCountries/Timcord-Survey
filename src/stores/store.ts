import { ref } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
import surveyQuestions from '../assets/questions.json'
import Question from '../components/question.ts'
import type { MultipleChoiceAnswer } from '../components/question.ts'

enum QuestionList {
  debug_questions,
  questions,
}

export const useQuestionInfoStore = defineStore('questionInfo', () => {
  const currentDestination = ref<string | null>(null)
  const questionsAnswered = ref<number>(0)
  const debug = ref<QuestionList>(QuestionList.questions)
  const questionList = ref<Question[]>(getQuestionList(debug.value))
  const currentQuestion = ref<Question>(_.cloneDeep(questionList.value[0]))
  const currentResponse = ref<MultipleChoiceAnswer | string | null>(null)
  const buttonPressed = ref<number>(0)
  const answers = ref<Question[]>([])

  function getQuestionList(qList: QuestionList): Question[] {
    let questions = []
    switch (qList) {
      case QuestionList.debug_questions:
        questions = surveyQuestions.debug_questions
        break
      case QuestionList.questions:
        questions = surveyQuestions.questions
        break
      default:
        questions = surveyQuestions.questions
        break
    }
    questions = questions.map((question) => new Question(question))
    return questions
  }

  function setUpUnitTests() {
    currentDestination.value = null
    questionsAnswered.value = 0
    debug.value = QuestionList.debug_questions
    questionList.value = getQuestionList(debug.value)
    currentQuestion.value = _.cloneDeep(questionList.value[0])
    currentResponse.value = null
    buttonPressed.value = 0
    answers.value = []
  }

  function previousQuestion() {
    currentQuestion.value.submitAnswer(currentResponse.value)
    answers.value[questionsAnswered.value] = currentQuestion.value
    questionsAnswered.value--
    currentQuestion.value = _.cloneDeep(answers.value[questionsAnswered.value])
    currentDestination.value = currentQuestion.value.destination
    currentResponse.value = currentQuestion.value.response
    buttonPressed.value = 1
    buttonPressed.value = 0
  }

  function nextQuestion() {
    if (currentResponse.value === currentQuestion.value.response) {
      currentQuestion.value.submitAnswer(currentResponse.value)
      answers.value[questionsAnswered.value] = currentQuestion.value
      currentDestination.value = currentQuestion.value.destination
      currentQuestion.value = _.cloneDeep(
        answers.value.length > questionsAnswered.value + 1
          ? answers.value[questionsAnswered.value + 1]
          : (questionList.value.find((x) => x.id === currentDestination.value) ?? answers.value[0]),
      )
    } else {
      currentQuestion.value.submitAnswer(currentResponse.value)
      answers.value[questionsAnswered.value] = currentQuestion.value
      currentDestination.value = currentQuestion.value.destination
      currentQuestion.value = _.cloneDeep(
        questionList.value.find((x) => x.id === currentDestination.value) ?? answers.value[0],
      )
    }

    currentQuestion.value.substitute()

    if (answers.value.length > questionsAnswered.value + 1) {
      const questionLocation = answers.value.find((x) => x.id == currentQuestion.value.id)
      currentResponse.value = ((questionLocation as Question) ?? { response: null }).response
    } else {
      currentResponse.value = null
    }

    questionsAnswered.value++
    buttonPressed.value = 1
    buttonPressed.value = 0
  }

  return {
    currentDestination,
    questionsAnswered,
    debug,
    questionList,
    currentQuestion,
    currentResponse,
    buttonPressed,
    answers,
    setUpUnitTests,
    previousQuestion,
    nextQuestion,
  }
})
