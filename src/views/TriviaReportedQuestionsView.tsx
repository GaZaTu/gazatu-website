import * as React from "react";
import { hot } from "react-hot-loader";
import DankTable, { DankTableColumn, tableRenderDate, tableSortDate } from "../components/DankTable";
import { RouteComponentProps } from "react-router";
import { toaster } from "../components/spectre/SpectreToastContainer";
import { triviaApi, ReportedQuestionData } from "../api/trivia.api";
import SpectreIcon from "../components/spectre/SpectreIcon";

interface RouteParams { }

interface Props extends RouteComponentProps<RouteParams> { }

interface State {
  data: ReportedQuestionData[]
}

class TriviaReportedQuestionsView extends React.PureComponent<Props, State> {
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
          <DankTableColumn name="">
            {(_, row) => (
              <a href={`#/trivia/questions/${row._id}`}>
                <SpectreIcon icon="share" />
              </a>
            )}
          </DankTableColumn>

          <DankTableColumn name="category" filter="select">
          </DankTableColumn>

          <DankTableColumn name="question" flex="3" filter="input">
          </DankTableColumn>

          <DankTableColumn name="hint1">
          </DankTableColumn>

          <DankTableColumn name="hint2">
          </DankTableColumn>

          <DankTableColumn name="submitter" filter="select">
          </DankTableColumn>

          <DankTableColumn name="updatedAt" onSort={tableSortDate}>
            {tableRenderDate}
          </DankTableColumn>
        </DankTable>
      </div>
    )
  }
}

export default hot(module)(TriviaReportedQuestionsView)
