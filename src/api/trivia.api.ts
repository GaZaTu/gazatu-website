import { ApiEndpointGroup, api, loading } from "../utils";
import { observable } from "mobx";

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

export interface Statistics {
  questionCount: number
  verifiedQuestionCount: number
  categoryCount: number
  topCategories: { category: string, submissions: number }[]
  topSubmitters: { submitter: string, submissions: number }[]
  submissionDates: { createdAt: number }[]
}

export class TriviaBadges {
  @observable
  reportCount = 0
  @observable
  reportedQuestionCount = 0
  @observable
  unverifiedQuestionCount = 0

  load() {
    return Promise.all([
      triviaApi.reportCount().then(res => this.reportCount = res),
      triviaApi.reportedQuestionCount().then(res => this.reportedQuestionCount = res),
      triviaApi.questionCount({ verified: false }).then(res => this.unverifiedQuestionCount = res),
    ])
  }
}

export const triviaBadges = new TriviaBadges()

export const triviaApi = {
  questions: new ApiEndpointGroup<QuestionData>("/trivia/questions"),
  questionReports: (questionId: string) => api.get(`/trivia/questions/${questionId}/reports`).then(res => res.data as QuestionReportData[]),
  report: (questionId: string, data: { submitter: string, message: string }) => api.post(`/trivia/questions/${questionId}/reports`, data),
  reports: () => api.get("/trivia/reports").then(res => res.data as ReportData[]),
  reportedQuestions: () => api.get("/trivia/reported-questions").then(res => res.data as ReportedQuestionData[]),
  categories: () => api.get("/trivia/categories").then(res => res.data as string[]),
  statistics: () => api.get("/trivia/statistics").then(res => res.data as Statistics),
  reportCount: () => api.get("/trivia/report-count").then(res => res.data.count as number),
  reportedQuestionCount: () => api.get("/trivia/reported-question-count").then(res => res.data.count as number),
  questionCount: (params?: any) => api.get("/trivia/question-count", { params }).then(res => res.data.count as number),
  emptyQuestion: () => ({
    category: "",
    question: "",
    answer: "",
    hint1: "",
    hint2: "",
    submitter: "",
  } as Partial<QuestionData>),
}
