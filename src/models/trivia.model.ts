import { EndpointGroup, api } from "../utils";

export interface QuestionData {
  _id: string
  category: string
  question: string
  answer: string
  hint1?: string
  hint2?: string
  submitter?: string
  verified: boolean
  disabled: boolean
  createdAt: string
  updatedAt: string
}

const triviaQuestionsApi = new EndpointGroup<QuestionData>("/trivia/questions")

export const triviaApi = {
  questions: triviaQuestionsApi,
  categories: () => api.get("/trivia/categories").then(res => res.data),
  emptyQuestion: () => ({
    category: "",
    question: "",
    answer: "",
    hint1: "",
    hint2: "",
    submitter: "",
  }),
}
