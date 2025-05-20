import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import surveyQuestions from './assets/questions.json'

export const useQuestionInfoStore = defineStore('questionInfo', () => {
    const currentQuestion = ref(0)
    const currentAnswer = ref({...surveyQuestions.questions[0]})
    const answers = ref([])

    function nextQuestion() {
      currentAnswer.value = {...surveyQuestions.questions[currentQuestion.value]}
        currentAnswer.value.index = currentQuestion.value
        if (answers.value.length > (currentQuestion.value + 1)) {
            answers.value[currentQuestion.value] = {...currentAnswer.value}
        } else {
            answers.value.push({...currentAnswer})
        }
        currentQuestion.value++
        console.log(answers.value)
    }
    return { currentQuestion, currentAnswer, answers, nextQuestion }
})
