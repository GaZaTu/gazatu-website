import * as React from "react";
import DankTable, { DankTableColumn, tableRenderDate, tableSortDate } from "../components/DankTable";
import { QuestionData, triviaApi, triviaBadges } from "../api/trivia.api";
import { RouteComponentProps } from "react-router";
import { toaster } from "../components/spectre/SpectreToastContainer";
import SpectreIcon from "../components/spectre/SpectreIcon";
import * as queryString from "query-string";
import { authorization } from "../utils";
import { showConfirmation } from "../components/spectre/SpectreModalContainer";
import { showMenu } from "../components/spectre/SpectreMenuContainer";
import SpectreMenu from "../components/spectre/SpectreMenu";
import SpectreMenuItem from "../components/spectre/SpectreMenuItem";

export function triviaQuestionsDankTableColumns() {
  return [
    (<DankTableColumn key={1} name="">
      {(_, row) => (
        <a href={`#/trivia/questions/${row._id}`}>
          <SpectreIcon icon="share" />
        </a>
      )}
    </DankTableColumn>),
    (<DankTableColumn key={2} name="category" filter="select">
    </DankTableColumn>),
    (<DankTableColumn key={3} name="question" flex="3" filter="input">
    </DankTableColumn>),
    (<DankTableColumn key={4} name="hint1">
    </DankTableColumn>),
    (<DankTableColumn key={5} name="hint2">
    </DankTableColumn>),
    (<DankTableColumn key={6} name="submitter" filter="select">
    </DankTableColumn>),
    (<DankTableColumn key={7} name="updatedAt" onSort={tableSortDate}>
      {tableRenderDate}
    </DankTableColumn>),
  ]
}

interface RouteParams { }

interface Props extends RouteComponentProps<RouteParams> { }

interface State {
  data: QuestionData[]
}

export default class TriviaQuestionsView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      data: [],
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.location.search !== prevProps.location.search) {
      this.load()
    }
  }

  async load() {
    try {
      this.setState({
        data: await triviaApi.questions.get({
          shuffled: false,
          ...this.query,
        }),
      })
    } catch (error) {
      toaster.error(`${error}`)
    }
  }

  componentDidMount() {
    this.load()
  }

  handleRowContextMenu = (row: QuestionData, event: React.MouseEvent) => {
    if (!authorization.hasPermission("trivia")) {
      return
    }

    event.preventDefault()

    const handleVerify = async () => {
      if (await showConfirmation("Verify?")) {
        await triviaApi.questions.id(row._id).put({ verified: true })
        await this.load()
        triviaBadges.load()
      }

      menu.hide()
    }

    const handleDelete = async () => {
      if (await showConfirmation("Delete?")) {
        await triviaApi.questions.id(row._id).delete()
        await this.load()
        triviaBadges.load()
      }

      menu.hide()
    }

    const menu = showMenu((
      <SpectreMenu>
        <SpectreMenuItem>
          <a className="c-hand text-success" onClick={handleVerify}>Verify</a>
        </SpectreMenuItem>
        <SpectreMenuItem>
          <a className="c-hand text-error" onClick={handleDelete}>Delete</a>
        </SpectreMenuItem>
      </SpectreMenu>
    ), { pos: event, removePrevious: true })
  }

  render() {
    const columns = triviaQuestionsDankTableColumns()

    if (this.query.verified === "false") {
      columns.push(
        <DankTableColumn key={11} name="answer" filter="input">
        </DankTableColumn>
      )
    }

    return (
      <div style={{ padding: 0 }}>
        <h3 className="s-title">Questions</h3>
        <DankTable data={this.state.data} style={{ maxHeight: "unset", overflow: "unset" }} keepHeadOnMobile onRowContextMenu={this.handleRowContextMenu} hotkeys>
          {columns}
        </DankTable>
      </div>
    )
  }

  get query() {
    return queryString.parse(this.props.location.search)
  }
}
