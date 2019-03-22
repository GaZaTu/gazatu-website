import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Formik, FormikActions } from "formik";
import { QuestionData, triviaApi, QuestionReportData, triviaBadges } from "../api/trivia.api";
import { loading, authorization } from "../utils";
import { toaster } from "../components/spectre/SpectreToastContainer";
import * as idbKeyval from "idb-keyval";
import DankTable, { DankTableColumn, tableRenderDate, tableSortDate } from "../components/DankTable";
import { showConfirmation } from "../components/spectre/SpectreModalContainer";
import SpectreButtonGroup from "../components/spectre/SpectreButtonGroup";
import SpectreIcon from "../components/spectre/SpectreIcon";
import SpectreFormGroup from "../components/spectre/SpectreFormGroup";
import SpectreFormikInput from "../components/spectre-formik/SpectreFormikInput";
import SpectreFormikForm from "../components/spectre-formik/SpectreFormikForm";
import SpectreFormikButton from "../components/spectre-formik/SpectreFormikButton";
import SpectreFormikFormGroup from "../components/spectre-formik/SpectreFormikFormGroup";
import SpectreInput from "../components/spectre/SpectreInput";
import SpectreForm from "../components/spectre/SpectreForm";

interface RouteParams {
  id: string
}

interface Props extends RouteComponentProps<RouteParams> { }

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

export default class TriviaQuestionsIdView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      loading: false,
      readOnly: true,
      data: triviaApi.emptyQuestion(),
      categories: [],
      newAfterSave: false,
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
        data: await triviaApi.questions.id(this.id).get(),
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
      await triviaApi.questions.id(this.id).put(data)

      if (this.state.newAfterSave) {
        this.id = "new"
      } else {
        this.loadData()
      }
    }

    await this.setState({
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
      await triviaApi.questions.id(this.id).delete()
      triviaBadges.load()
      this.props.history.push("/trivia/questions")
    }
  }

  handleVerify = async () => {
    const accepted = await showConfirmation("Verify?")

    if (accepted) {
      this.state.data.verified = true

      await triviaApi.questions.id(this.id).put(this.state.data)
      await this.load()
      triviaBadges.load()
    }
  }

  handleReport = async () => {
    const data = {
      submitter: "",
      message: "",
    }

    const accepted = await showConfirmation(
      <SpectreForm>
        <h5>Report question</h5>

        <SpectreFormGroup label="Username*">
          <SpectreInput placeholder="Username" onChange={ev => data.submitter = ev.target.value} required />
        </SpectreFormGroup>

        <SpectreFormGroup label="Reason*">
          <SpectreInput placeholder="Reason" onChange={ev => data.message = ev.target.value} required />
        </SpectreFormGroup>
      </SpectreForm>
    )

    if (accepted) {
      await triviaApi.report(this.id, data)
      await this.load()
    }
  }

  render() {
    return (
      <div>
        <h3 className="s-title">Question</h3>
        <Formik
          enableReinitialize
          initialValues={this.state.data}
          onSubmit={this.handleSubmit}
        >
          {form => (
            <SpectreFormikForm formik={form} horizontal>
              <SpectreButtonGroup className="col-5 col-sm-12 col-ml-auto" style={{ paddingBottom: "1rem" }} block>
                {this.state.hasTriviaPermission && (
                  <SpectreFormikButton formik={form} type="button" kind="error" loading={this.state.loading} disabled={this.isNew} onClick={this.handleDelete}>
                    <SpectreIcon icon="delete" />
                  </SpectreFormikButton>
                )}

                {this.state.hasTriviaPermission && (
                  <SpectreFormikButton formik={form} type="button" kind="success" loading={this.state.loading} disabled={this.isNew || this.state.data.verified} onClick={this.handleVerify}>
                    <SpectreIcon icon="emoji" />
                  </SpectreFormikButton>
                )}

                <SpectreFormikButton formik={form} type="button" loading={this.state.loading} disabled={this.isNew || this.state.data.verified} onClick={this.handleReport}>
                  <SpectreIcon icon="flag" />
                </SpectreFormikButton>

                <SpectreFormikButton formik={form} type="submit" loading={this.state.loading} disabled={this.state.readOnly} onClick={this.handleSaveAndNew}>
                  <SpectreIcon icon="check" />
                  <SpectreIcon icon="plus" />
                </SpectreFormikButton>

                <SpectreFormikButton formik={form} type="submit" loading={this.state.loading} disabled={this.state.readOnly}>
                  <SpectreIcon icon="check" />
                </SpectreFormikButton>
              </SpectreButtonGroup>

              <SpectreFormikFormGroup name="category" label="Category*">
                <SpectreFormikInput placeholder="Category" options={this.state.categories} readOnly={this.state.readOnly} required />
              </SpectreFormikFormGroup>

              <SpectreFormikFormGroup name="question" label="Question*">
                <SpectreFormikInput placeholder="Question" readOnly={this.state.readOnly} required />
              </SpectreFormikFormGroup>

              <SpectreFormikFormGroup name="answer" label="Answer*">
                <SpectreFormikInput placeholder="Answer" readOnly={this.state.readOnly} required />
              </SpectreFormikFormGroup>

              <SpectreFormikFormGroup name="hint1" label="First hint">
                <SpectreFormikInput placeholder="First hint" readOnly={this.state.readOnly} />
              </SpectreFormikFormGroup>

              <SpectreFormikFormGroup name="hint2" label="Second hint">
                <SpectreFormikInput placeholder="Second hint" readOnly={this.state.readOnly} />
              </SpectreFormikFormGroup>

              <SpectreFormikFormGroup name="submitter" label="Username">
                <SpectreFormikInput placeholder="Username" readOnly={this.state.readOnly} />
              </SpectreFormikFormGroup>
            </SpectreFormikForm>
          )}
        </Formik>

        {this.state.showReports && (
          <DankTable data={this.state.reports} style={{ maxHeight: "unset", overflow: "unset" }} caption="Reports">
            <DankTableColumn name="message">
            </DankTableColumn>

            <DankTableColumn name="submitter">
            </DankTableColumn>

            <DankTableColumn name="updatedAt" onSort={tableSortDate}>
              {tableRenderDate}
            </DankTableColumn>
          </DankTable>
        )}
      </div>
    )
  }
}
