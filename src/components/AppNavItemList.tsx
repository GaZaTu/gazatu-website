import * as React from "react";
import { hot } from "react-hot-loader";
import { Link } from "react-router-dom";
import AppNavItemLink from "./AppNavItemLink";

class AppNavItemList extends React.Component<{ title: string, titleTo?: string }> {
  render() {
    const active = (location.hash.substr(1) === this.props.titleTo) || this.isActive()

    return (
      <li className={`nav-item ${active && "active"}`}>
        {this.props.titleTo ? (<Link to={this.props.titleTo}>{this.props.title}</Link>) : (<a>{this.props.title}</a>)}
        <ul className="nav">
          {this.props.children}
        </ul>
      </li>
    )
  }

  isActive(propsChildren = this.props.children) {
    const children = Array.isArray(propsChildren) ? propsChildren : [propsChildren]

    for (const child of children) {
      if (typeof child === "object") {
        const childAsElem = child as React.ReactElement<any>

        if (typeof childAsElem.type === "function") {
          if (childAsElem.type.prototype instanceof AppNavItemLink) {
            if (location.hash.substr(1) === childAsElem.props.to) {
              return true
            }
          } else if (childAsElem.type.prototype instanceof AppNavItemList) {
            if (this.isActive(childAsElem.props.children)) {
              return true
            }
          }
        }
      }
    }

    return false
  }
}

export default hot(module)(AppNavItemList)
