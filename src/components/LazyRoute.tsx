import * as React from "react";
import { hot } from "react-hot-loader";
import { Route } from "react-router-dom";
import LazyComponent from "./LazyComponent";

interface Props {
  exact?: boolean
  path: string
  provider: () => Promise<any>
}

const LazyRoute = (props: Props) => (
  <Route exact={props.exact} path={props.path} component={() => <LazyComponent provider={props.provider} />} />
)

export default hot(module)(LazyRoute)
