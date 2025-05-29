import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuestionInfoStore } from '../store.ts'

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
    store.currentResponse = 'DEBUG_intro_red'
    store.nextQuestion()
    expect(store.answers[0].response).toBe('DEBUG_intro_red')
    expect(store.currentResponse).toBe(null)
  })

  it('can change previous answers and keep unansweDEBUG_intro_red questions', () => {
    store.currentResponse = 'DEBUG_intro_yellow'
    store.nextQuestion()
    expect(store.answers[0].response).toBe('DEBUG_intro_yellow')

    store.currentResponse = 'DEBUG_substitution_no'
    store.previousQuestion()
    expect(store.currentResponse).toBe('DEBUG_intro_yellow')

    store.currentResponse = 'DEBUG_intro_purple'
    store.nextQuestion()
    expect(store.answers[0].response).toBe('DEBUG_intro_purple')
    expect(store.currentResponse).toBe('DEBUG_substitution_no')
  })

  it('can interrupt the donut loop', () => {
    store.currentResponse = 'DEBUG_intro_red'
    store.nextQuestion()
    store.currentResponse = 'DEBUG_substitution_no'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_substitution')
    store.previousQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_substitution')
    store.currentResponse = 'DEBUG_substitution_yes'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_branch')
  })

  it('can continue the donut loop', () => {
    store.currentResponse = 'DEBUG_intro_orange'
    store.nextQuestion()
    store.currentResponse = 'DEBUG_substitution_yes'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_branch')
    store.previousQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_substitution')
    store.currentResponse = 'DEBUG_substitution_no'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_substitution')
  })

  it('can go back and change its path without keeping previous answers', () => {
    store.currentResponse = 'DEBUG_intro_green'
    store.nextQuestion()
    store.currentResponse = 'DEBUG_substitution_yes'
    store.nextQuestion()
    store.currentResponse = 'DEBUG_branch_left'
    store.nextQuestion()
    store.currentResponse = 'testing 1 2 3'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_finish')
    store.previousQuestion()
    expect(store.currentResponse).toBe('testing 1 2 3')
    store.previousQuestion()
    store.currentResponse = 'DEBUG_branch_right'
    store.nextQuestion()
    expect(store.currentResponse).toBe(null)
    store.currentResponse = 'testing 4 5 6'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_finish')
  })
})
