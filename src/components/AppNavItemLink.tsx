import * as React from "react";
import { Link } from "react-router-dom";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  children?: React.ReactNode
  to: string
}

export default class AppNavItemLink extends React.Component<Props> {
  render() {
    const { children, to, ...nativeProps } = this.props
    const className = classNames({
      "nav-item": true,
      "active": location.hash.substr(1) === to,
    }, nativeProps.className)

    return (
      <li {...nativeProps} className={className}>
        <Link to={to}>{children}</Link>
      </li>
    )
  }
}
