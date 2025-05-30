import surveyQuestions from '../assets/questions.json'

export class Substitutions {
  [to_replace: string]: string[]
}

export enum QuestionList {
  debug_questions,
  questions,
}

export interface MultipleChoiceAnswer {
  id: string
  text: string
  destination: string
}

export enum QuestionType {
  multiple_choice,
  written_response,
  end,
  other,
}

export class Question {
  id: string
  title: string
  substitutions: Substitutions = surveyQuestions.substitutions as Substitutions
  question_type: QuestionType = QuestionType.other
  answers: MultipleChoiceAnswer[] = []
  character_limit?: number = -1
  response: MultipleChoiceAnswer | string | null = null
  destination: string | null = null

  constructor(question: {
    id: string
    title: string
    substitutions: string[]
    question_type: string
    answers?: {
      id: string
      text: string
      destination: string
    }[]
    character_limit?: number
    response: string | null
    destination: string | null
  }) {
    this.id = question.id
    this.title = question.title
    this.substitutions = Object.fromEntries(
      Object.entries(this.substitutions).filter((x) => question.substitutions.includes(x[0])),
    ) as Substitutions
    this.question_type = QuestionType[question.question_type as keyof typeof QuestionType]
    switch (this.question_type) {
      case QuestionType.multiple_choice:
        this.answers = question.answers as MultipleChoiceAnswer[]
        break
      case QuestionType.written_response:
        this.character_limit = question.character_limit
        this.destination = question.destination
        break
      case QuestionType.end:
        this.response = null
        this.destination = null
        break
      case QuestionType.other:
        break
      default:
        throw new TypeError('Unknown enum type')
    }
  }

  submitAnswer(response: MultipleChoiceAnswer | string | null) {
    this.response = response
    this.destination =
      ((response as MultipleChoiceAnswer) ?? { destination: null }).destination ?? this.destination
  }

  findAnswer(id: string): MultipleChoiceAnswer | null {
    return this.answers.find((x) => x.id === id) ?? null
  }

  substitute() {
    for (const [sub, repls] of Object.entries(this.substitutions)) {
      const replacement = repls[Math.floor(Math.random() * repls.length)]
      this.title = this.title.replace(sub, replacement)
      this.answers = this.answers.map((answer) => {
        answer.text = answer.text.replace(sub, replacement)
        return answer
      })
    }
  }
}
