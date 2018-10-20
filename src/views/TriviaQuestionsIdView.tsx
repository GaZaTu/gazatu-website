import * as React from "react";
import { hot } from "react-hot-loader";
import { RouteComponentProps } from "react-router";
import { Formik, Form, Field, FormikActions, FormikProps } from "formik";
import { QuestionData, triviaApi } from "../models/trivia.model";
import { loading } from "../utils";

interface RouteParams {
  id: string
}

type Props = RouteComponentProps<RouteParams>

interface State {
  loading: boolean
  data: Partial<QuestionData>
  categories: any[]
}

class TriviaQuestionsIdView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      loading: false,
      data: triviaApi.emptyQuestion(),
      categories: [],
    }
  }

  get id() {
    return this.props.match.params.id
  }

  set id(id: string) {
    this.props.history.push(`/trivia/questions/${id}`)
  }

  @loading
  async load() {
    await this.loadData()
    await Promise.all([
      this.loadCategories(),
    ])
  }

  @loading
  async save(data: Partial<QuestionData>) {
    await this.saveData(data)
  }

  async loadData() {
    if (this.id === "new") {
      this.setState({
        data: triviaApi.emptyQuestion(),
      })
    } else {
      this.setState({
        data: await triviaApi.questions.getById(this.id),
      })
    }
  }

  async saveData(data: Partial<QuestionData>) {
    if (this.id === "new") {
      const res = await triviaApi.questions.post(data)

      this.id = res._id
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
    this.load()
  }

  handleSubmit = async (data: Partial<QuestionData>, actions: FormikActions<Partial<QuestionData>>) => {
    this.setState({ data })

    await this.save(data)

    actions.setSubmitting(false)
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
              <div className="btn-group btn-group-block col-1 col-sm-3 col-ml-auto">
                <button className={`btn ${this.state.loading || form.isSubmitting ? "loading" : ""}`} type="submit">
                  <i className="icon icon-check"></i>
                </button>
              </div>

              <div className="form-group">
                <div className="col-4 col-sm-12">
                  <label className="form-label">Category*</label>
                  <Field className="form-input" name="category" placeholder="Category" required list="categories" />
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
                  <Field className="form-input" name="question" placeholder="Question" required />
                </div>
              </div>

              <div className="form-group">
                <div className="col-6 col-sm-12">
                  <label className="form-label">Answer*</label>
                  <Field className="form-input" name="answer" placeholder="Answer" />
                </div>
              </div>

              <div className="form-group">
                <div className="col-6 col-sm-12">
                  <label className="form-label">First hint</label>
                  <Field className="form-input" name="hint1" placeholder="First hint" />
                </div>

                <div className="col-6 col-sm-12">
                  <label className="form-label">Second hint</label>
                  <Field className="form-input" name="hint2" placeholder="Second hint" />
                </div>
              </div>

              <div className="form-group">
                <div className="col-4 col-sm-12">
                  <label className="form-label">Username</label>
                  <Field className="form-input" name="submitter" placeholder="Username" />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    )
  }
}

export default hot(module)(TriviaQuestionsIdView)
