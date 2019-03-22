import * as React from "react";
import DankTable from "../components/DankTable";
import { RouteComponentProps } from "react-router";
import { toaster } from "../components/spectre/SpectreToastContainer";
import { triviaApi, ReportedQuestionData } from "../api/trivia.api";
import { triviaQuestionsDankTableColumns } from "./TriviaQuestionsView";

interface RouteParams { }

interface Props extends RouteComponentProps<RouteParams> { }

interface State {
  data: ReportedQuestionData[]
}

export default class TriviaReportedQuestionsView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      data: [],
    }
  }

  async load() {
    try {
      this.setState({
        data: await triviaApi.reportedQuestions(),
      })
    } catch (error) {
      toaster.error(`${error}`)
    }
  }

  componentDidMount() {
    this.load()
  }

  render() {
    return (
      <div style={{ padding: 0 }}>
        <h3 className="s-title">Reported Questions</h3>
        <DankTable data={this.state.data} style={{ maxHeight: "unset", overflow: "unset" }} keepHeadOnMobile>
          {triviaQuestionsDankTableColumns()}
        </DankTable>
      </div>
    )
  }
}
