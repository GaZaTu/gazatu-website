import * as React from "react";
import { RouteComponentProps } from "react-router";

interface RouteParams { }

interface Props extends RouteComponentProps<RouteParams> { }

interface State { }

export default class StartView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = { }
  }

  render() {
    return (
      <img className="img-responsive" style={{ marginLeft: 30, marginTop: 30 }} src="/img/FeelsDankMan.png" />
    )
  }
}
