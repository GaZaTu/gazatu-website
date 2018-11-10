import * as React from "react";
import { hot } from "react-hot-loader";
import { RouteComponentProps } from "react-router";

interface RouteParams { }

type Props = RouteComponentProps<RouteParams>

interface State { }

class StartView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = { }
  }

  render() {
    return (
      <img className="img-responsive" src="/img/FeelsDankMan.png" />
    )
  }
}

export default hot(module)(StartView)
