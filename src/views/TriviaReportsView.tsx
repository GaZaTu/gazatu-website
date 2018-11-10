import * as React from "react";
import { hot } from "react-hot-loader";
import DankTable, { DankColumn, tableRenderDate, tableSortDate } from "../components/DankTable";
import { RouteComponentProps } from "react-router";
import { toaster } from "../components/ToastContainer";
import { ReportData, triviaApi } from "../api/trivia.api";

interface RouteParams { }

type Props = RouteComponentProps<RouteParams>

interface State {
  data: ReportData[]
}

class TriviaReportsView extends React.PureComponent<Props, State> {
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
        <DankTable data={this.state.data} style={{ maxHeight: "unset", overflow: "unset" }} caption="Reports" keepHeadOnMobile>
          <DankColumn name="" render={(_, row) => (<a href={`#/trivia/questions/${row.question}`}><i className="icon icon-share" /></a>)} />
          <DankColumn name="message" filter="input" />
          <DankColumn name="submitter" filter="select" />
          <DankColumn name="updatedAt" render={tableRenderDate} onSort={tableSortDate} />
        </DankTable>
      </div>
    )
  }
}

export default hot(module)(TriviaReportsView)
