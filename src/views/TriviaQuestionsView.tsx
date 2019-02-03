import * as React from "react";
import { hot } from "react-hot-loader";
import DankTable, { DankTableColumn, tableRenderDate, tableSortDate } from "../components/DankTable";
import { QuestionData, triviaApi } from "../api/trivia.api";
import { RouteComponentProps } from "react-router";
import { toaster } from "../components/spectre/SpectreToastContainer";
import SpectreIcon from "../components/spectre/SpectreIcon";

interface RouteParams { }

interface Props extends RouteComponentProps<RouteParams> { }

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
        <h3 className="s-title">Questions</h3>
        <DankTable data={this.state.data} style={{ maxHeight: "unset", overflow: "unset" }} keepHeadOnMobile onRowContextMenu={this.handleRowClick}>
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

export default hot(module)(TriviaQuestionsView)
