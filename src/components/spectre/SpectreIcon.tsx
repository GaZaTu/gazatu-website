import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  icon: "arrow-up" | "arrow-right" | "arrow-down" | "arrow-left" | "upward" | "forward" | "downward" | "back" | "caret" | "menu" | "apps" | "more-horiz" | "more-vert" | "cross" | "check" | "stop" | "shutdown" | "refresh" | "search" | "flag" | "bookmark" | "edit" | "delete" | "share" | "download" | "upload" | "copy" | "mail" | "people" | "message" | "photo" | "time" | "location" | "link" | "emoji" | "plus"
}

class SpectreIcon extends React.PureComponent<Props> {
  render() {
    const { icon, ...nativeProps } = this.props
    const className = classNames(`icon icon-${icon}`, nativeProps.className)

    return (
      <i {...nativeProps} className={className} />
    )
  }
}

export default hot(module)(SpectreIcon)
