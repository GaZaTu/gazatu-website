import * as React from "react";
import { hot } from "react-hot-loader";

interface Props {
  provider: () => Promise<any>
}

interface State {
  Component: any
}

class LazyComponent extends React.PureComponent<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      Component: null,
    }
  }

  componentDidMount() {
    if (!this.state.Component) {
      this.props.provider()
        .then(exports => this.setState({ Component: exports.default }))
    }
  }

  render() {
    const { Component } = this.state

    return (
      <div>
        {Component ? <Component /> : <div className="loading loading-lg" />}
      </div>
    )
  }
}

export default hot(module)(LazyComponent)
