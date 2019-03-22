import * as React from "react";
import DankTable, { DankTableColumn, tableRenderDate, tableSortDate } from "../components/DankTable";
import { RouteComponentProps } from "react-router";
import { toaster } from "../components/spectre/SpectreToastContainer";
import { ReportData, triviaApi } from "../api/trivia.api";
import SpectreIcon from "../components/spectre/SpectreIcon";

interface RouteParams { }

interface Props extends RouteComponentProps<RouteParams> { }

interface State {
  data: ReportData[]
}

export default class TriviaReportsView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      data: [],
    }
  }

  async load() {
    try {
      this.setState({
        data: await triviaApi.reports(),
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
        <h3 className="s-title">Reports</h3>
        <DankTable data={this.state.data} style={{ maxHeight: "unset", overflow: "unset" }} keepHeadOnMobile>
          <DankTableColumn name="">
            {(_, row) => (
              <a href={`#/trivia/questions/${row.question}`}>
                <SpectreIcon icon="share" />
              </a>
            )}
          </DankTableColumn>

          <DankTableColumn name="message" filter="input">
          </DankTableColumn>

          <DankTableColumn name="submitter" filter="input">
          </DankTableColumn>

          <DankTableColumn name="updatedAt" onSort={tableSortDate}>
            {tableRenderDate}
          </DankTableColumn>
        </DankTable>
      </div>
    )
  }
}
