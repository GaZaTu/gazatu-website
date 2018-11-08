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

export interface ReportData {

}

export interface ReportedQuestionData {

}

const triviaQuestionsApi = new ApiEndpointGroup<QuestionData>("/trivia/questions")

export const triviaApi = {
  questions: triviaQuestionsApi,
  questionReports: (questionId: string) => api.get(`/trivia/questions/${questionId}/reports`).then(res => res.data as QuestionReportData[]),
  report: (questionId: string, data: { submitter: string, message: string }) => api.post(`/trivia/questions/${questionId}/reports`, data),
  reports: () => api.get("/trivia/reports").then(res => res.data as ReportData[]),
  reportedQuestions: () => api.get("/trivia/reported-question").then(res => res.data as ReportedQuestionData[]),
  categories: () => api.get("/trivia/categories").then(res => res.data as string[]),
  emptyQuestion: () => ({
    category: "",
    question: "",
    answer: "",
    hint1: "",
    hint2: "",
    submitter: "",
  } as Partial<QuestionData>),
}
