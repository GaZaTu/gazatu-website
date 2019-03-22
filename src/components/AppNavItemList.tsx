import * as React from "react";
import { Link } from "react-router-dom";
import * as classNames from "classnames";
import AppNavItemLink from "./AppNavItemLink";
import { reactNodeIsComponent } from "../utils";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  children?: React.ReactNode
  title: string,
  titleTo?: string,
  matchStartsWith?: string,
}

export default class AppNavItemList extends React.Component<Props> {
  render() {
    const { children, title, titleTo, matchStartsWith, ...nativeProps } = this.props
    const className = classNames({
      "nav-item": true,
      "active": (location.hash.substr(1) === titleTo) || this.isActive(),
    }, nativeProps.className)

    return (
      <li {...nativeProps} className={className}>
        {titleTo ? (<Link to={titleTo}>{title}</Link>) : (<a style={{ pointerEvents: "none" }}>{title}</a>)}
        <ul className="nav">
          {children}
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
