import { ref } from 'vue'
import { defineStore } from 'pinia'
import surveyQuestions from './assets/questions.json'

export const useQuestionInfoStore = defineStore('questionInfo', () => {
    const currentQuestion = ref(0)
    const currentAnswer = ref({...surveyQuestions.questions[0]})
    const currentAnswerBeforeSubstitution = ref({...surveyQuestions.questions[0]})
    const currentResponse = ref(null)
    const answers = ref([{}])
    answers.value.pop()

    function nextQuestion() {
        currentAnswer.value.index = currentQuestion.value
        currentAnswer.value.question.response = currentResponse.value
        if (answers.value.length > (currentQuestion.value + 1)) {
          answers.value[currentQuestion.value] = {...currentAnswer.value}
        } else {
          answers.value.push({...currentAnswer.value})
        }
        if (currentResponse.value !== "donut_loop_yes") {
            currentQuestion.value++
        }
        console.log(currentAnswer.value)
        currentAnswer.value = {...surveyQuestions.questions[currentQuestion.value]}
        currentAnswerBeforeSubstitution.value = {...surveyQuestions.questions[currentQuestion.value]}
        currentAnswer.value.title = currentAnswerBeforeSubstitution.value.title
        currentResponse.value = null
    }
    return { currentQuestion, currentAnswer, currentAnswerBeforeSubstitution, currentResponse, answers, nextQuestion }
})
