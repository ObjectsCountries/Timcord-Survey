import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuestionInfoStore } from '../store.ts'
import { QuestionList } from '../../components/question.ts'
import type { MultipleChoiceAnswer } from '../../components/question.ts'

describe('Question Info Store Test', () => {
  setActivePinia(createPinia())
  const store = useQuestionInfoStore()
  beforeEach(() => {
    store.restart(QuestionList.DEBUG_questions)
  })

  it('initializes with correct values', () => {
    expect(store.answers.length).toBe(0)
  })

  it('registers the given answer and clears the current answer upon going to the next question', () => {
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_red')
    store.nextQuestion()
    expect((store.answers[0].response as MultipleChoiceAnswer).id).toBe('DEBUG_intro_red')
    expect(store.currentResponse).toBeNull()
  })

  it('can change previous answers and keep unsubmitted questions', () => {
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_yellow')
    store.nextQuestion()
    expect((store.answers[0].response as MultipleChoiceAnswer).id).toBe('DEBUG_intro_yellow')

    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_substitution_no')
    store.previousQuestion()
    expect((store.currentResponse as MultipleChoiceAnswer).id).toBe('DEBUG_intro_yellow')

    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_purple')
    store.nextQuestion()
    expect((store.answers[0].response as MultipleChoiceAnswer).id).toBe('DEBUG_intro_purple')
    expect((store.currentResponse as MultipleChoiceAnswer).id).toBe('DEBUG_substitution_no')
  })

  it('can interrupt the donut loop', () => {
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_red')
    store.nextQuestion()
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_substitution_no')
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_substitution')
    store.previousQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_substitution')
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_substitution_yes')
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_branch')
  })

  it('can continue the donut loop', () => {
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_orange')
    store.nextQuestion()
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_substitution_yes')
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_branch')
    store.previousQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_substitution')
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_substitution_no')
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_substitution')
  })

  it('can go back and change its path without keeping previous answers', () => {
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_green')
    store.nextQuestion()
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_substitution_yes')
    store.nextQuestion()
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_branch_left')
    store.nextQuestion()
    store.currentResponse = 'testing 1 2 3'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_finish')
    store.previousQuestion()
    expect(store.currentResponse).toBe('testing 1 2 3')
    store.previousQuestion()
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_branch_right')
    store.nextQuestion()
    expect(store.currentResponse).toBeNull()
    store.currentResponse = 'testing 4 5 6'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_finish')
  })

  it('correctly substitutes', () => {
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_blue')
    store.nextQuestion()
    expect(store.currentQuestion.title).not.toEqual(expect.stringContaining('DEBUG_substitution_1'))
    expect(store.currentQuestion.title).not.toEqual(expect.stringContaining('DEBUG_substitution_2'))
    const substituted = store.currentQuestion.title.substring(
      'You got any '.length,
      store.currentQuestion.title.length - '?'.length,
    )
    for (const answer of store.currentQuestion.answers ?? []) {
      expect(answer.text).toEqual(expect.stringContaining(substituted))
    }
  })
})
