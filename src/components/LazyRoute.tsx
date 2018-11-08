import * as React from "react";
import { hot } from "react-hot-loader";
import { Route } from "react-router-dom";
import LazyComponent from "./LazyComponent";

interface Props {
  exact?: boolean
  path: string
  provider: () => Promise<any>
}

class LazyRoute extends React.PureComponent<Props> {
  render() {
    return (
      <Route exact={this.props.exact} path={this.props.path} component={(routeComponentProps: any) => (
        <LazyComponent provider={this.props.provider} routeComponentProps={routeComponentProps} />
      )} />
    )
  }
}

export default hot(module)(LazyRoute)
