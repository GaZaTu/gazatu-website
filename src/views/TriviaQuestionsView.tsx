import * as React from "react";
import { hot } from "react-hot-loader";
import DankTable, { DankColumn, tableRenderDate, tableSortDate } from "../components/DankTable";
import { QuestionData, triviaApi } from "../api/trivia.api";
import { RouteComponentProps } from "react-router";
import { toaster } from "../components/SpectreToastContainer";
import { showMenu } from "../components/SpectreMenuContainer";

interface RouteParams { }

type Props = RouteComponentProps<RouteParams>

interface State {
  data: QuestionData[]
}

class TriviaQuestionsView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      data: [],
    }
  }

  async load() {
    try {
      this.setState({
        data: await triviaApi.questions.get({ shuffled: false }),
      })
    } catch (error) {
      toaster.error(`${error}`)
    }
  }

  componentDidMount() {
    this.load()
  }

  handleRowClick = (row: QuestionData, event: React.MouseEvent) => {
    // event.preventDefault()
    // event.persist()

    // const handleVerify = () => {

    // }

    // const handleDelete = () => {

    // }

    // const menu = showMenu((
    //   <ul className="menu">
    //     <li className="menu-item">
    //       <a className="c-hand" onClick={handleVerify}>Verify</a>
    //     </li>
    //     <li className="menu-item">
    //       <a className="c-hand" onClick={handleDelete}>Delete</a>
    //     </li>
    //   </ul>
    // ), { pos: event, removePrevious: true })
  }

  render() {
    return (
      <div style={{ padding: 0 }}>
        <DankTable data={this.state.data} style={{ maxHeight: "unset", overflow: "unset" }} caption="Questions" keepHeadOnMobile onRowContextMenu={this.handleRowClick}>
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

export default hot(module)(TriviaQuestionsView)
