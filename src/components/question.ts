import surveyQuestions from '../assets/questions.json'

export type MultipleChoiceAnswer = {
  id: string
  text: string
  destination: string
}

export enum QuestionType {
  intro,
  multiple_choice,
  written_response,
  end,
  end_with_lap2,
  other,
}

export enum QuestionList {
  questions = '',
  LAP2_questions = 'LAP2_',
  DEBUG_questions = 'DEBUG_',
  DEBUG_LAP2_questions = 'DEBUG_LAP2_',
}

export type PrimitiveQuestion = {
  id: string
  title: string
  substitutions: number
  question_type: string
  answers?: MultipleChoiceAnswer[]
  character_limit?: number
  response: string | null
  destination: string | null
}

type QuestionChanges = Partial<Omit<PrimitiveQuestion, 'id'>>

export type Lap2Question = {
  id: string
  copy_of: string
  changes: QuestionChanges
}

type SubstitutionsWithReferences = {
  [category: string]: { [subQuestion: string]: (string | string[])[] }
}

type Substitution = {
  [subQuestion: string]: string[][]
}

type AllSubs = { [category: string]: Substitution }

type Survey = {
  substitution_categories: AllSubs
  question_categories: { [category: string]: (PrimitiveQuestion | Lap2Question)[] }
}

function convertSubstitutionReferences(subs: SubstitutionsWithReferences): AllSubs {
  const result: SubstitutionsWithReferences = subs
  for (const [category, question] of Object.entries(subs)) {
    for (const [subQuestion, replacement] of Object.entries(question)) {
      for (const substitution of replacement) {
        if (typeof substitution === 'string') {
          const [copy_category, copy_question, copy_index] = substitution.split(' ')
          result[category][subQuestion][replacement.indexOf(substitution)] =
            result[copy_category][copy_question][Number(copy_index)]
        }
      }
    }
  }
  return result as AllSubs
}

export default class Question {
  id: string
  title: string
  substitutions: number
  question_type: QuestionType = QuestionType.other
  question_list: QuestionList
  answers?: MultipleChoiceAnswer[]
  character_limit?: number
  response: MultipleChoiceAnswer | string | null = null
  destination: string | null = null

  static defaults: PrimitiveQuestion = {
    id: 'ERROR',
    title: 'Something has gone wrong. Please report this to Vice.',
    substitutions: 0,
    question_type: 'end',
    response: null,
    destination: null,
  }

  static survey: Survey = {
    substitution_categories: convertSubstitutionReferences(surveyQuestions.substitution_categories),
    question_categories: surveyQuestions.question_categories,
  }

  static errorQuestion: Question = new Question(Question.defaults, QuestionList.questions)

  constructor(question: Partial<PrimitiveQuestion> | Lap2Question, qList: QuestionList) {
    this.question_list = qList
    this.id = question.id ?? Question.defaults.id
    if ((question as Lap2Question).changes === undefined) {
      question = question as PrimitiveQuestion
      this.title = question.title ?? Question.defaults.title
      this.substitutions = question.substitutions ?? Question.defaults.substitutions
      this.destination = question.destination ?? Question.defaults.destination
      this.question_type =
        QuestionType[(question.question_type ?? QuestionType.other) as keyof typeof QuestionType]
      switch (this.question_type) {
        case QuestionType.multiple_choice:
          this.answers = question.answers ?? ([] as MultipleChoiceAnswer[])
          break
        case QuestionType.written_response:
          this.character_limit = question.character_limit ?? -1
          break
        case QuestionType.intro:
        case QuestionType.end:
        case QuestionType.end_with_lap2:
        case QuestionType.other:
          this.response = null
          break
        default:
          throw new TypeError('Unknown enum type')
      }
    } else {
      this.title = Question.defaults.title
      this.substitutions = Question.defaults.substitutions
      const [copy_category, copy_question] = ((question as Lap2Question).copy_of ?? '_ _').split(
        ' ',
      )
      if (copy_category !== '_' && copy_question !== '_') {
        const copy: PrimitiveQuestion | Lap2Question | null =
          Question.survey.question_categories[copy_category].find((x) => x.id === copy_question) ??
          null
        return new Question(
          {
            ...copy,
            id: (question as Lap2Question).id,
            ...(question as Lap2Question).changes,
          },
          qList,
        )
      } else {
        throw TypeError('Lap2Question without copy_of found!')
      }
    }
  }

  submitAnswer(response: MultipleChoiceAnswer | string | null) {
    this.response = response
    this.destination =
      ((response as MultipleChoiceAnswer) ?? { destination: null }).destination ?? this.destination
  }

  findAnswer(id: string): MultipleChoiceAnswer | null {
    return (this.answers ?? []).find((x) => x.id === id) ?? null
  }

  substitute() {
    let sub = 'S'
    let replacement = ''
    let replacement_array = []
    for (let i = 0; i < this.substitutions; ++i) {
      sub = `S${i}`
      replacement_array =
        Question.survey.substitution_categories[this.question_list + 'substitutions'][this.id][i]
      replacement = replacement_array[Math.floor(Math.random() * replacement_array.length)]
      this.title = this.title.replace(sub, replacement)
      this.answers = (this.answers ?? []).map((answer) => {
        answer.text = answer.text.replace(sub, replacement)
        return answer
      })
    }
  }
}
