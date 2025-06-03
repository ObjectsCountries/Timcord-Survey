import surveyQuestions from '../assets/questions.json'

export type Substitutions = Record<string, string[]>

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
  substitutions: string[]
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

export type SurveyPart<Type extends Record<string, string>, Element, Replace extends string> = {
  [Property in Type[keyof Type] as `${string & Property}${Replace}`]: Element
}

type Survey = {
  substitution_categories: SurveyPart<typeof QuestionList, Substitutions, 'substitutions'>
  question_categories: SurveyPart<
    typeof QuestionList,
    (PrimitiveQuestion | Lap2Question)[],
    'questions'
  >
}

export default class Question {
  id: string
  title: string
  substitutions: Substitutions
  question_type: QuestionType = QuestionType.other
  answers?: MultipleChoiceAnswer[]
  character_limit?: number
  response: MultipleChoiceAnswer | string | null = null
  destination: string | null = null

  static defaults: PrimitiveQuestion = {
    id: 'ERROR',
    title: 'Something has gone wrong. Please report this to Vice.',
    substitutions: [],
    question_type: 'end',
    response: null,
    destination: null,
  }
  static survey: Survey = surveyQuestions

  static errorQuestion: Question = new Question(Question.defaults, {})

  constructor(question: Partial<PrimitiveQuestion> | Lap2Question, substitutions: Substitutions) {
    this.id = question.id ?? Question.defaults.id
    if ((question as Lap2Question).changes === undefined) {
      question = question as PrimitiveQuestion
      this.title = question.title ?? Question.defaults.title
      this.substitutions = Object.fromEntries(
        Object.entries(substitutions ?? {}).filter((x) =>
          (question as PrimitiveQuestion).substitutions.includes(x[0]),
        ),
      )
      this.destination = question.destination ?? null
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
      this.substitutions = Object.fromEntries(
        Object.entries(substitutions ?? {}).filter((x) =>
          (question as Lap2Question).changes?.substitutions?.includes(x[0]),
        ),
      )
      const [copy_category, copy_question] = ((question as Lap2Question).copy_of ?? '_ _').split(
        ' ',
      )
      if (copy_category !== '_' && copy_question !== '_') {
        const copy: PrimitiveQuestion | Lap2Question | null =
          Question.survey.question_categories[
            copy_category as keyof SurveyPart<
              typeof QuestionList,
              (PrimitiveQuestion | Lap2Question)[],
              'questions'
            >
          ].find((x) => x.id === copy_question) ?? null
        return new Question(
          {
            ...copy,
            id: (question as Lap2Question).id,
            ...(question as Lap2Question).changes,
          },
          substitutions,
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
    for (const [sub, repls] of Object.entries(this.substitutions)) {
      const replacement = repls[Math.floor(Math.random() * repls.length)]
      this.title = this.title.replace(sub, replacement)
      this.answers = (this.answers ?? []).map((answer) => {
        answer.text = answer.text.replace(sub, replacement)
        return answer
      })
    }
  }
}
