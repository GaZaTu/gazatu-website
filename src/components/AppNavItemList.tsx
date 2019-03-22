import * as React from "react";
import { Link } from "react-router-dom";
import AppNavItemLink from "./AppNavItemLink";
import { reactNodeIsComponent } from "../utils";

interface Props {
  title: string,
  titleTo?: string,
  matchStartsWith?: string,
}

export default class AppNavItemList extends React.Component<Props> {
  render() {
    const active = (location.hash.substr(1) === this.props.titleTo) || this.isActive()

    return (
      <li className={`nav-item ${active && "active"}`}>
        {this.props.titleTo ? (<Link to={this.props.titleTo}>{this.props.title}</Link>) : (<a style={{ pointerEvents: "none" }}>{this.props.title}</a>)}
        <ul className="nav">
          {this.props.children}
        </ul>
      </li>
    )
  }

  isActive(propsChildren = this.props.children) {
    const children = Array.isArray(propsChildren) ? propsChildren : [propsChildren]

    if (this.props.matchStartsWith) {
      if (location.hash.substr(1).startsWith(this.props.matchStartsWith)) {
        return true
      }
    }

    for (const child of children) {
      if (reactNodeIsComponent(child, AppNavItemLink)) {
        if (location.hash.substr(1) === child.props.to) {
          return true
        }
      } else if (reactNodeIsComponent(child, AppNavItemLink)) {
        if (this.isActive(child.props.children)) {
          return true
        }
      }
    }

    return false
  }
}
