import * as React from "react";
import { hot } from "react-hot-loader";
import DankTable, { DankColumn } from "../components/DankTable";
import { IdType } from "../utils";

export interface QuestionData {
  id: IdType
  category: string
  question: string
  hint1: string | null
  hint2: string | null
  submitter: string | null
}

interface Props { }

interface State {
  questions: QuestionData[]
}

class TriviaQuestionsView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      questions: [],
    }
  }

  componentDidMount() {
    // fetch("https://api.gazatu.win/trivia/questions?shuffled=false")
    //   .then(res => res.json())
    //   .then(questions => this.setState({ questions }))
    
    const questions = [] as any[]

    for (let i = 0; i < 1010; i++) {
      questions.push({
        id: i,
        category: `category${i}`,
        question: `question${i} bla bla xdd `,
        hint1: i % 3 === 0 ? `hint1${i}` : null,
        hint2: i % 6 === 0 ? `hint2${i}` : null,
        submitter: i % 4 === 0 ? `submitter${i}` : null,
      })
    }

    this.setState({ questions })
  }

  render() {
    return (
      <div style={{ padding: 0 }}>
        <DankTable data={this.state.questions} style={{ maxHeight: "unset", overflow: "unset" }} caption="Questions" keepHeadOnMobile>
          <DankColumn name="id" render={id => (<a href={`#/trivia/questions/${id}`}>{id}</a>)} />
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
