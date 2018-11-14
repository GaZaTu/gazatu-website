import * as React from "react";
import { hot } from "react-hot-loader";
import DankTable, { DankColumn, tableRenderDate, tableSortDate } from "../components/DankTable";
import { RouteComponentProps } from "react-router";
import { toaster } from "../components/SpectreToastContainer";
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

type Props = RouteComponentProps<RouteParams>

interface State {
  data: RouteData[]
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
        <h3>Api-Ref</h3>
        <h5>{api.defaults.baseURL}</h5>

        <div className="columns">
          {this.state.data.map(route => (
            <div className="column col-6 col-xs-12" style={{ padding: ".4rem" }}>
              <div className="card">
                <div className="columns" style={{ margin: "unset" }}>
                  <span className="column col-3" style={{ padding: ".2rem", backgroundColor: "#3c3c3c", textAlign: "center" }}>{route.type.toUpperCase()}</span>
                  <span className="column col-9" style={{ padding: ".2rem", backgroundColor: "#484848" }}>{route.route}</span>
                </div>
                <div className="card-body">
                  {route.params.length > 0 && (
                    <div>
                      <h6>Params</h6>
                      <DankTable data={route.params} style={{ maxHeight: "unset", overflow: "unset", marginLeft: "-0.85rem", marginRight: "-0.85rem" }} disableEmptyMsg>
                        <DankColumn name="type" />
                        <DankColumn name="name" />
                        <DankColumn name="required" render={v => v ? "yes" : "no"} />
                      </DankTable>
                    </div>
                  )}

                  {route.responseHandlers.length > 0 && (
                    <div>
                      <h6 style={{ marginTop: ".6rem" }}>Response Handlers</h6>
                      <DankTable data={route.responseHandlers} style={{ maxHeight: "unset", overflow: "unset", marginLeft: "-0.85rem", marginRight: "-0.85rem" }} disableEmptyMsg>
                        <DankColumn name="type" />
                        <DankColumn name="value" />
                      </DankTable>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default hot(module)(TriviaQuestionsView)
