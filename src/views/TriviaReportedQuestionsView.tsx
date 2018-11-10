import * as React from "react";
import { hot } from "react-hot-loader";
import DankTable, { DankColumn, tableRenderDate, tableSortDate } from "../components/DankTable";
import { RouteComponentProps } from "react-router";
import { toaster } from "../components/ToastContainer";
import { triviaApi, ReportedQuestionData } from "../api/trivia.api";

interface RouteParams { }

type Props = RouteComponentProps<RouteParams>

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
        <DankTable data={this.state.data} style={{ maxHeight: "unset", overflow: "unset" }} caption="Reported Questions" keepHeadOnMobile>
          <DankColumn name="" render={(_, row) => (<a href={`#/trivia/questions/${row._id}`}><i className="icon icon-share" /></a>)} />
          <DankColumn name="category" filter="select" />
          <DankColumn name="question" flex="3" filter="input" />
          <DankColumn name="hint1" />
          <DankColumn name="hint2" />
          <DankColumn name="submitter" filter="select" />
          <DankColumn name="updatedAt" render={tableRenderDate} onSort={tableSortDate} />
        </DankTable>
      </div>
    )
  }
}

export default hot(module)(TriviaReportedQuestionsView)
