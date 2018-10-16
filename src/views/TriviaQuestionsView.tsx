import * as React from "react";
import { hot } from "react-hot-loader";
import DankTable from "../components/DankTable";

interface Question { }

interface Props { }

interface State {
  questions: Question[]
}

class TriviaQuestionsView extends React.Component<Props, State> {
  cols = [
    { key: "id" },
    { key: "category" },
    { key: "question", flex: "5" },
    { key: "hint1" },
    { key: "hint2" },
    { key: "submitter" },
  ]

  constructor(props: Props) {
    super(props)

    this.state = {
      questions: [],
    }
  }

  componentDidMount() {
    fetch("https://api.gazatu.win/trivia/questions?shuffled=false")
      .then(res => res.json())
      .then(questions => this.setState({ questions }))
  }

  render() {
    return (
      <div style={{ padding: 0 }}>
        <DankTable cols={this.cols} data={this.state.questions} style={{ maxHeight: "unset", overflow: "unset" }} caption="Questions" />
      </div>
    )
  }
}

export default hot(module)(TriviaQuestionsView)
