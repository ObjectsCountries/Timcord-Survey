import { ref } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
import { QuestionType, QuestionList } from '../components/question.ts'
import Question from '../components/question.ts'
import type {
  Substitutions,
  MultipleChoiceAnswer,
  PrimitiveQuestion,
  Lap2Question,
  SurveyPart,
} from '../components/question.ts'

export const useQuestionInfoStore = defineStore('questionInfo', () => {
  const currentDestination = ref<string | null>(null)
  const questionsAnswered = ref<number>(0)
  const debug = ref<QuestionList>(QuestionList.questions)
  const debugLap = ref<'questions' | 'lap2_questions'>('questions')
  const questionList = ref<Question[]>(getQuestionList(debug.value))
  const currentQuestion = ref<Question>(_.cloneDeep(questionList.value[0]))
  const currentResponse = ref<MultipleChoiceAnswer | string | null>(null)
  const buttonPressed = ref<number>(0)
  const answers = ref<{ questions: Question[]; lap2_questions: Question[] }>({
    questions: [],
    lap2_questions: [],
  })

  function getQuestionList(qList: QuestionList): Question[] {
    const substitutions: Substitutions =
      Question.survey.substitution_categories[
        (qList + 'substitutions') as keyof SurveyPart<
          typeof QuestionList,
          Substitutions,
          'substitutions'
        >
      ]
    const questions: Question[] = Question.survey.question_categories[
      (qList + 'questions') as keyof SurveyPart<
        typeof QuestionList,
        (PrimitiveQuestion | Lap2Question)[],
        'questions'
      >
    ].map((question) => new Question(question, substitutions))
    return questions
  }

  /** Initializes the store values to prepare for unit tests.
   *  @param questionGroup The question group to start from.
   */
  function restart(questionGroup: QuestionList) {
    currentDestination.value = null
    questionsAnswered.value = 0
    debug.value = questionGroup
    questionList.value = getQuestionList(debug.value)
    currentQuestion.value = _.cloneDeep(questionList.value[0])
    currentResponse.value = null
    buttonPressed.value = 0
    if ([QuestionList.DEBUG_LAP2_questions, QuestionList.LAP2_questions].includes(questionGroup)) {
      debugLap.value = 'lap2_questions'
    } else {
      debugLap.value = 'questions'
      answers.value = {
        questions: [],
        lap2_questions: [],
      }
    }
  }

  /** Goes back one question, preserving any current answer. */
  function previousQuestion() {
    currentQuestion.value.submitAnswer(currentResponse.value)
    answers.value[debugLap.value as keyof typeof answers.value][questionsAnswered.value] =
      currentQuestion.value
    questionsAnswered.value--
    currentQuestion.value = _.cloneDeep(
      answers.value[debugLap.value as keyof typeof answers.value][questionsAnswered.value],
    )
    currentDestination.value = currentQuestion.value.destination
    currentResponse.value = currentQuestion.value.response
    buttonPressed.value = 1
    buttonPressed.value = 0
  }

  /** Goes forward one question, responding to changes in answers. */
  function nextQuestion() {
    if (currentQuestion.value.question_type === QuestionType.end_with_lap2) {
      restart(
        debug.value === QuestionList.DEBUG_questions
          ? QuestionList.DEBUG_LAP2_questions
          : QuestionList.LAP2_questions,
      )
      return
    }
    if (currentResponse.value === currentQuestion.value.response) {
      currentQuestion.value.submitAnswer(currentResponse.value)
      answers.value[debugLap.value as keyof typeof answers.value][questionsAnswered.value] =
        currentQuestion.value
      currentDestination.value = currentQuestion.value.destination
      currentQuestion.value = _.cloneDeep(
        answers.value[debugLap.value as keyof typeof answers.value].length >
          questionsAnswered.value + 1
          ? answers.value[debugLap.value as keyof typeof answers.value][questionsAnswered.value + 1]
          : (questionList.value.find((x) => x.id === currentDestination.value) ??
              Question.errorQuestion),
      )
    } else {
      currentQuestion.value.submitAnswer(currentResponse.value)
      answers.value[debugLap.value as keyof typeof answers.value][questionsAnswered.value] =
        currentQuestion.value
      currentDestination.value = currentQuestion.value.destination
      currentQuestion.value = _.cloneDeep(
        questionList.value.find((x) => x.id === currentDestination.value) ?? Question.errorQuestion,
      )
    }

    currentQuestion.value.substitute()

    // If answering a question that has already been answered, change the current response to be the current question's response
    if (
      answers.value[debugLap.value as keyof typeof answers.value].length >
      questionsAnswered.value + 1
    ) {
      const questionLocation = answers.value[debugLap.value as keyof typeof answers.value].find(
        (x) => x.id == currentQuestion.value.id,
      )
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
    restart,
    previousQuestion,
    nextQuestion,
  }
})
