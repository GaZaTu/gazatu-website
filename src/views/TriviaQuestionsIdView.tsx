import * as React from "react";
import { hot } from "react-hot-loader";
import { RouteComponentProps } from "react-router";
import { Formik, Form, Field, FormikActions, FormikProps } from "formik";
import { QuestionData, triviaApi, QuestionReportData } from "../api/trivia.api";
import { loading, authorization } from "../utils";
import { toaster } from "../components/ToastContainer";
import * as idbKeyval from "idb-keyval";
import DankTable, { DankColumn } from "../components/DankTable";

interface RouteParams {
  id: string
}

type Props = RouteComponentProps<RouteParams>

interface State {
  loading: boolean
  readOnly: boolean
  data: Partial<QuestionData>
  categories: any[]
  newAfterSave: boolean
  showReports: boolean
  reports: QuestionReportData[]
}

class TriviaQuestionsIdView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      loading: false,
      readOnly: true,
      data: triviaApi.emptyQuestion(),
      categories: [],
      newAfterSave: true,
      showReports: false,
      reports: [],
    }
  }

  get id() {
    return this.props.match.params.id
  }

  set id(id: string) {
    this.props.history.push(`/trivia/questions/${id}`)
  }

  get isNew() {
    return (this.id === "new")
  }

  @loading
  async load() {
    try {
      await this.loadData()
      await Promise.all([
        this.loadCategories(),
      ])
    } catch (error) {
      toaster.error(`${error}`)
      throw error
    }
  }

  async save(data: Partial<QuestionData>) {
    await this.saveData(data)
  }

  async loadData() {
    if (this.isNew) {
      const submitData = await idbKeyval.get<any>("TriviaSubmitData")
      
      this.setState({
        data: Object.assign(triviaApi.emptyQuestion(), submitData),
      })
    } else {
      this.setState({
        data: await triviaApi.questions.getById(this.id),
      })
    }
  }

  async loadReports() {
    if (this.isNew) {
      this.setState({
        reports: [],
      })
    } else {
      this.setState({
        reports: await triviaApi.questionReports(this.id).get(),
      })
    }
  }

  async saveData(data: Partial<QuestionData>) {
    if (this.isNew) {
      await idbKeyval.set("TriviaSubmitData", {
        category: data.category,
        submitter: data.submitter,
      })

      const res = await triviaApi.questions.post(data)

      if (this.state.newAfterSave) {
        this.setState({
          newAfterSave: false,
        })

        if (!this.isNew) {
          this.id = "new"
        }
      } else {
        this.id = res._id
      }
    } else {
      await triviaApi.questions.put(this.id, data)
    }
  }

  async loadCategories() {
    this.setState({
      categories: await triviaApi.categories(),
    })
  }

  componentDidMount() {
    const hasTriviaPermission = authorization.hasPermission("trivia")

    this.setState({
      readOnly: !this.isNew && !hasTriviaPermission,
      showReports: !this.isNew && hasTriviaPermission,
    })

    this.load()
  }

  isLoading(form?: { isSubmitting: boolean }) {
    return (this.state.loading || (form && form.isSubmitting))
  }

  handleSubmit = async (data: Partial<QuestionData>, actions: FormikActions<Partial<QuestionData>>) => {
    this.setState({ data })

    try {
      await this.save(data)
    } catch (error) {
      toaster.error(`${error}`)
    }

    actions.setSubmitting(false)
  }

  handleSaveAndNew = () => {
    this.setState({
      newAfterSave: true,
    })
  }

  render() {
    return (
      <div>
        <h2>Question</h2>
        <Formik
          enableReinitialize
          initialValues={this.state.data}
          onSubmit={this.handleSubmit}
        >
          {(form: FormikProps<Partial<QuestionData>>) => (
            <Form className="form-horizontal">
              <div className="btn-group btn-group-block col-2 col-sm-6 col-ml-auto">
                <button className={`btn ${this.isLoading(form) ? "loading" : ""}`} type="submit" disabled={this.state.readOnly} onClick={this.handleSaveAndNew}>
                  <i className="icon icon-check" />
                  <i className="icon icon-plus" />
                </button>

                <button className={`btn ${this.isLoading(form) ? "loading" : ""}`} type="submit" disabled={this.state.readOnly}>
                  <i className="icon icon-check" />
                </button>
              </div>

              <div className="form-group">
                <div className="col-4 col-sm-12">
                  <label className="form-label">Category*</label>
                  <Field className="form-input" name="category" placeholder="Category" required list="categories" readOnly={this.state.readOnly} />
                  <datalist id="categories">
                    {this.state.categories.map(category => (
                      <option key={category}>{category}</option>
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="form-group">
                <div className="col-9 col-sm-12">
                  <label className="form-label">Question*</label>
                  <Field className="form-input" name="question" placeholder="Question" required readOnly={this.state.readOnly} />
                </div>
              </div>

              <div className="form-group">
                <div className="col-6 col-sm-12">
                  <label className="form-label">Answer*</label>
                  <Field className="form-input" name="answer" placeholder="Answer" required readOnly={this.state.readOnly} />
                </div>
              </div>

              <div className="form-group">
                <div className="col-6 col-sm-12">
                  <label className="form-label">First hint</label>
                  <Field className="form-input" name="hint1" placeholder="First hint" readOnly={this.state.readOnly} />
                </div>

                <div className="col-6 col-sm-12">
                  <label className="form-label">Second hint</label>
                  <Field className="form-input" name="hint2" placeholder="Second hint" readOnly={this.state.readOnly} />
                </div>
              </div>

              <div className="form-group">
                <div className="col-4 col-sm-12">
                  <label className="form-label">Username</label>
                  <Field className="form-input" name="submitter" placeholder="Username" readOnly={this.state.readOnly} />
                </div>
              </div>
            </Form>
          )}
        </Formik>

        {this.state.showReports && (<DankTable data={this.state.reports} style={{ maxHeight: "unset", overflow: "unset" }} caption="Reports">
          <DankColumn name="message" />
          <DankColumn name="submitter" />
        </DankTable>)}
      </div>
    )
  }
}

export default hot(module)(TriviaQuestionsIdView)
