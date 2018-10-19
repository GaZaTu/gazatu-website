import * as React from "react";
import { hot } from "react-hot-loader";
import { QuestionData } from "./TriviaQuestionsView";

interface Props { }

interface State {
  data: Partial<QuestionData>
}

class TriviaQuestionsIdView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      data: {},
    }
  }

  componentDidMount() {
    // fetch(`https://api.gazatu.win/trivia/questions/${this.id}`)
    //   .then(res => res.json())
    //   .then(data => this.setState({ data }))

    this.setState({
      data: {
        id: 0,
        category: "the_category",
        question: "the question",
        hint1: "first hint",
        hint2: null,
        submitter: null,
      },
    })
  }

  render() {
    return (
      <div>
        
      </div>
    )
  }
}

export default hot(module)(TriviaQuestionsIdView)
