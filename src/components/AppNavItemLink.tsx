import * as React from "react";
import { hot } from "react-hot-loader";
import { Link } from "react-router-dom";

class AppNavItemLink extends React.Component<{ to: string }> {
  render() {
    const active = (location.hash.substr(1) === this.props.to)

    return (
      <li className={`nav-item ${active && "active"}`}>
        <Link to={this.props.to}>{this.props.children}</Link>
      </li>
    )
  }
}

export default hot(module)(AppNavItemLink)
