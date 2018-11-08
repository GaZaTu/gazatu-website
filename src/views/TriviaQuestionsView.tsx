import * as React from "react";
import { hot } from "react-hot-loader";
import DankTable, { DankColumn } from "../components/DankTable";
import { QuestionData, triviaApi } from "../api/trivia.api";
import { RouteComponentProps } from "react-router";
import { toaster } from "../components/ToastContainer";

interface RouteParams { }

type Props = RouteComponentProps<RouteParams>

interface State {
  questions: QuestionData[]
}

class TriviaQuestionsView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      questions: [],
    }
  }

  async load() {
    try {
      this.setState({
        questions: await triviaApi.questions.get({ shuffled: false }),
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
        <DankTable data={this.state.questions} style={{ maxHeight: "unset", overflow: "unset" }} caption="Questions" keepHeadOnMobile>
          <DankColumn name="" render={(id, row) => (<a href={`#/trivia/questions/${row._id}`}><i className="icon icon-share" /></a>)} />
          <DankColumn name="category" filter="select" />
          <DankColumn name="question" flex="5" filter="input" />
          <DankColumn name="hint1" />
          <DankColumn name="hint2" />
          <DankColumn name="submitter" filter="select" />
        </DankTable>
      </div>
    )
  }
}

export default hot(module)(TriviaQuestionsView)
