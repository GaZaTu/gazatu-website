import { ApiEndpointGroup, api } from "../utils";

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

export interface QuestionReportData {
  _id: string
  question: QuestionData
  message: string
  submitter: string
}

const triviaQuestionsApi = new ApiEndpointGroup<QuestionData>("/trivia/questions")

export const triviaApi = {
  questions: triviaQuestionsApi,
  questionReports: (questionId: string) => new ApiEndpointGroup<QuestionReportData>(`/trivia/questions/${questionId}`),
  reports: () => api.get("/trivia/reports").then(res => res.data),
  reportedQuestions: () => api.get("/trivia/reported-question").then(res => res.data),
  categories: () => api.get("/trivia/categories").then(res => res.data),
  emptyQuestion: () => ({
    category: "",
    question: "",
    answer: "",
    hint1: "",
    hint2: "",
    submitter: "",
  } as Partial<QuestionData>),
}
