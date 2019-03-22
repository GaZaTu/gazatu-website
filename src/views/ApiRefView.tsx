import * as React from "react";
import { hot } from "react-hot-loader";
import DankTable, { DankTableColumn } from "../components/DankTable";
import { RouteComponentProps } from "react-router";
import { toaster } from "../components/spectre/SpectreToastContainer";
import { api } from "../utils";

interface RouteParamData {
  type: "body" | "param" | "query" | "queries"
  name?: string
  required: boolean
}

interface RouteResponseHandler {
  type: string
  value: any
}

interface RouteData {
  type: "get" | "post" | "put" | "delete"
  route: string
  params: RouteParamData[]
  responseHandlers: RouteResponseHandler[]
}

interface RouteParams { }

interface Props extends RouteComponentProps<RouteParams> { }

interface State {
  data: RouteData[]
}

export default class ApiRefView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      data: [],
    }
  }

  async load() {
    try {
      this.setState({
        data: await api.get("/meta/routes").then(r => r.data),
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
        <h3 className="s-title">Api-Ref</h3>
        <h5>{api.defaults.baseURL}</h5>

        <div className="columns">
          {this.state.data.map(route => (
            <div key={`${route.type}${route.route}`} className="column col-6 col-xs-12" style={{ padding: ".4rem" }}>
              <RouteCard route={route} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}

interface RouteCardProps {
  route: RouteData
}

interface RouteCardState {
  showBody: boolean
}

class RouteCard extends React.PureComponent<RouteCardProps, RouteCardState> {
  constructor(props: RouteCardProps) {
    super(props)

    this.state = {
      showBody: false,
    }
  }

  handleToggleBody = () => {
    this.setState({
      showBody: !this.state.showBody,
    })
  }

  render() {
    const { route } = this.props

    return (
      <div className="card">
        <div className="columns c-hand" style={{ margin: "unset" }} onClick={this.handleToggleBody}>
          <span className="column col-3" style={{ padding: ".2rem", backgroundColor: "#3c3c3c", textAlign: "center" }}>{route.type.toUpperCase()}</span>
          <span className="column col-9" style={{ padding: ".2rem", backgroundColor: "#484848" }}>{route.route}</span>
        </div>
        {this.state.showBody && (
          <div className="card-body">
            {route.params.length > 0 && (
              <div>
                <h6>Params</h6>
                <DankTable data={route.params} style={{ maxHeight: "unset", overflow: "unset", marginLeft: "-0.85rem", marginRight: "-0.85rem" }} disableEmptyMsg>
                  <DankTableColumn name="type" />
                  <DankTableColumn name="name" />
                  <DankTableColumn name="required">
                    {v => v ? "yes" : "no"}
                  </DankTableColumn>
                </DankTable>
              </div>
            )}

            {route.responseHandlers.length > 0 && (
              <div>
                <h6 style={{ marginTop: ".6rem" }}>Response Handlers</h6>
                <DankTable data={route.responseHandlers} style={{ maxHeight: "unset", overflow: "unset", marginLeft: "-0.85rem", marginRight: "-0.85rem" }} disableEmptyMsg>
                  <DankTableColumn name="type" />
                  <DankTableColumn name="value" />
                </DankTable>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}
