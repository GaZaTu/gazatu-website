import * as React from "react";
import DankTable, { DankTableColumn, tableRenderDate, tableSortDate } from "../components/DankTable";
import { RouteComponentProps } from "react-router";
import { toaster } from "../components/spectre/SpectreToastContainer";
import { UserData, authApi } from "../api/auth.api";
import SpectreIcon from "../components/spectre/SpectreIcon";

interface RouteParams { }

interface Props extends RouteComponentProps<RouteParams> { }

interface State {
  data: UserData[]
}

export default class TriviaQuestionsView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      data: [],
    }
  }

  async load() {
    try {
      this.setState({
        data: await authApi.users.get(),
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
        <h3 className="s-title">Users</h3>
        <DankTable data={this.state.data} style={{ maxHeight: "unset", overflow: "unset" }} keepHeadOnMobile>
          <DankTableColumn name="">
            {(_, row) => (
              <a href={`#/users/${row._id}`}>
                <SpectreIcon icon="share" />
              </a>
            )}
          </DankTableColumn>

          <DankTableColumn name="username" filter="input">
          </DankTableColumn>

          <DankTableColumn name="permissions" filter="input">
            {perms => perms.join(", ")}
          </DankTableColumn>

          <DankTableColumn name="updatedAt" onSort={tableSortDate}>
            {tableRenderDate}
          </DankTableColumn>
        </DankTable>
      </div>
    )
  }
}
