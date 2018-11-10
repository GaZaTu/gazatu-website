import * as React from "react";
import { hot } from "react-hot-loader";
import DankTable, { DankColumn, tableRenderDate, tableSortDate } from "../components/DankTable";
import { RouteComponentProps } from "react-router";
import { toaster } from "../components/ToastContainer";
import { UserData, authApi } from "../api/auth.api";

interface RouteParams { }

type Props = RouteComponentProps<RouteParams>

interface State {
  data: UserData[]
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
        <DankTable data={this.state.data} style={{ maxHeight: "unset", overflow: "unset" }} caption="Users" keepHeadOnMobile>
          <DankColumn name="" render={(_, row) => (<a href={`#/users/${row._id}`}><i className="icon icon-share" /></a>)} />
          <DankColumn name="username" filter="input" />
          <DankColumn name="permissions" filter="input" render={perms => perms.join(", ") } />
          <DankColumn name="updatedAt" render={tableRenderDate} onSort={tableSortDate} />
        </DankTable>
      </div>
    )
  }
}

export default hot(module)(TriviaQuestionsView)
