import * as React from "react";
import { hot } from "react-hot-loader";
import { RouteComponentProps } from "react-router";
import { Formik, Form, Field, FormikActions, FormikProps } from "formik";
import { QuestionData, triviaApi, QuestionReportData } from "../api/trivia.api";
import { loading, authorization } from "../utils";
import { toaster } from "../components/ToastContainer";
import * as idbKeyval from "idb-keyval";
import DankTable, { DankColumn } from "../components/DankTable";
import { showConfirmation } from "../components/ModalContainer";

interface RouteParams {
  id: string
}

type Props = RouteComponentProps<RouteParams>

interface State {
  loading: boolean
  readOnly: boolean
  data: Partial<QuestionData>
  categories: string[]
  newAfterSave: boolean
  showReports: boolean
  reports: QuestionReportData[]
  hasTriviaPermission: boolean
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
      hasTriviaPermission: false,
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
        this.loadReports(),
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
    if (this.isNew || !this.state.hasTriviaPermission) {
      this.setState({
        reports: [],
      })
    } else {
      this.setState({
        reports: await triviaApi.questionReports(this.id),
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
        this.loadData()
      } else {
        this.id = res._id
      }
    } else {
      await triviaApi.questions.put(this.id, data)

      this.id = "new"
    }

    this.setState({
      newAfterSave: false,
    })
  }

  async loadCategories() {
    this.setState({
      categories: await triviaApi.categories(),
    })
  }

  componentDidMount() {
    const hasTriviaPermission = authorization.hasPermission("trivia")

    this.setState({
      hasTriviaPermission: hasTriviaPermission,
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

  handleDelete = async () => {
    const accepted = await showConfirmation("Delete?")

    if (accepted) {
      await triviaApi.questions.delete(this.id)
      this.props.history.push("/trivia/questions")
    }
  }

  handleVerify = async () => {
    const accepted = await showConfirmation("Verify?")

    if (accepted) {
      await triviaApi.questions.put(this.id, this.state.data)
      await this.load()
    }
  }

  handleReport = async () => {
    const data = {
      submitter: "",
      message: "",
    }

    const accepted = await showConfirmation(
      <div className="form-horizontal">
        <h5>Report question</h5>

        <div className="form-group">
          <div className="col-12">
            <label className="form-label">Username*</label>
            <input className="form-input" placeholder="Username" required onChange={ev => data.submitter = ev.target.value} />
          </div>
        </div>

        <div className="form-group">
          <div className="col-12">
            <label className="form-label">Reason*</label>
            <input className="form-input" placeholder="Reason" required onChange={ev => data.message = ev.target.value} />
          </div>
        </div>
      </div>
    )

    if (accepted) {
      await triviaApi.report(this.id, data)
      await this.load()
    }
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
              <div className="btn-group btn-group-block col-5 col-sm-12 col-ml-auto">
                {this.state.hasTriviaPermission && (
                  <button className="btn btn-error" type="button" disabled={this.isNew} onClick={this.handleDelete}>
                    <i className="icon icon-delete" />
                  </button>
                )}
                
                {this.state.hasTriviaPermission && (
                  <button className="btn btn-success" type="button" disabled={this.isNew || this.state.data.verified} onClick={this.handleVerify}>
                    <i className="icon icon-emoji" />
                  </button>
                )}

                <button className="btn btn-warn" type="button" disabled={this.isNew} onClick={this.handleReport}>
                  <i className="icon icon-flag" />
                </button>

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

        {this.state.showReports && (
          <DankTable data={this.state.reports} style={{ maxHeight: "unset", overflow: "unset" }} caption="Reports">
            <DankColumn name="message" />
            <DankColumn name="submitter" />
          </DankTable>
        )}
      </div>
    )
  }
}

export default hot(module)(TriviaQuestionsIdView)
