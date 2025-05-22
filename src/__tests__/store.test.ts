import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuestionInfoStore } from '../stores/store.ts'

describe('Question Info Store Test', () => {
  let store = null

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useQuestionInfoStore()
    store.setUpUnitTests()
  })

  it('initializes with correct values', () => {
    expect(store.answers.length).toBe(0)
  })

  it('registers the given answer and clears the current answer upon going to the next question', () => {
    store.currentAnswer = 'red'
    store.nextQuestion()
    expect(store.answers[0].question.response).toBe('red')
    expect(store.currentAnswer).toBe(null)
  })

  it('can change previous answers and keep unanswered questions', () => {
    store.currentAnswer = 'yellow'
    store.nextQuestion()
    expect(store.answers[0].question.response).toBe('yellow')

    store.currentAnswer = 'donut_loop_no'
    store.previousQuestion()
    expect(store.currentAnswer).toBe('yellow')

    store.currentAnswer = 'purple'
    store.nextQuestion()
    expect(store.answers[0].question.response).toBe('purple')
    expect(store.currentAnswer).toBe('donut_loop_no')
  })

  it('can interrupt the donut loop', () => {
    store.currentAnswer = 'red'
    store.nextQuestion()
    store.currentAnswer = 'donut_loop_no'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_substitution_repetition')
    store.previousQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_substitution_repetition')
    store.currentAnswer = 'donut_loop_yes'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_written')
  })

  it('can continue the donut loop', () => {
    store.currentAnswer = 'orange'
    store.nextQuestion()
    store.currentAnswer = 'donut_loop_yes'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_written')
    store.previousQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_substitution_repetition')
    store.currentAnswer = 'donut_loop_no'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_substitution_repetition')
  })
})
