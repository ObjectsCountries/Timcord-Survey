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
    expect(store.answers.questions.length).toBe(0)
  })

  it('registers the given answer and clears the current answer upon going to the next question', () => {
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_red')
    store.nextQuestion()
    expect((store.answers.questions[0].response as MultipleChoiceAnswer).id).toBe('DEBUG_intro_red')
    expect(store.currentResponse).toBeNull()
  })

  it('can change previous answers and keep unsubmitted questions', () => {
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_yellow')
    store.nextQuestion()
    expect((store.answers.questions[0].response as MultipleChoiceAnswer).id).toBe(
      'DEBUG_intro_yellow',
    )

    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_donuts_no')
    store.previousQuestion()
    expect((store.currentResponse as MultipleChoiceAnswer).id).toBe('DEBUG_intro_yellow')

    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_purple')
    store.nextQuestion()
    expect((store.answers.questions[0].response as MultipleChoiceAnswer).id).toBe(
      'DEBUG_intro_purple',
    )
    expect((store.currentResponse as MultipleChoiceAnswer).id).toBe('DEBUG_donuts_no')
  })

  it('can interrupt the donut loop', () => {
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_red')
    store.nextQuestion()
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_donuts_no')
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_donuts')
    store.previousQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_donuts')
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_donuts_yes')
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_branch')
  })

  it('can continue the donut loop', () => {
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_orange')
    store.nextQuestion()
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_donuts_yes')
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_branch')
    store.previousQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_donuts')
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_donuts_no')
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_donuts')
  })

  it('can go back and change its path without keeping previous answers', () => {
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_green')
    store.nextQuestion()
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_donuts_yes')
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
    expect(store.currentQuestion.title).not.toEqual(expect.stringContaining('S0'))
    expect(store.currentQuestion.title).not.toEqual(expect.stringContaining('S1'))
    const substituted = store.currentQuestion.title.substring(
      'You got any '.length,
      store.currentQuestion.title.length - '?'.length,
    )
    for (const answer of store.currentQuestion.answers ?? []) {
      expect(answer.text).toEqual(expect.stringContaining(substituted))
    }
  })

  it('reaches Lap 2', () => {
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_green')
    store.nextQuestion()
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_donuts_yes')
    store.nextQuestion()
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_branch_left')
    store.nextQuestion()
    store.currentResponse = 'testing 1 2 3'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_finish')
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_LAP2_BEGIN_intro')
  })

  it('correctly copies question with substitutions and destination', () => {
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_intro_green')
    store.nextQuestion()
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_donuts_yes')
    store.nextQuestion()
    store.currentResponse = store.currentQuestion.findAnswer('DEBUG_branch_left')
    store.nextQuestion()
    store.currentResponse = 'testing 1 2 3'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_finish')
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_LAP2_BEGIN_intro')
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_LAP2_writing_copy')
    expect(store.currentQuestion.title).not.toEqual(expect.stringContaining('S0'))
    store.currentResponse = 'amogus'
    store.nextQuestion()
    expect(store.currentQuestion.id).toBe('DEBUG_LAP2_finish')
  })
})
