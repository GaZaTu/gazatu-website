import * as React from "react";
import * as classNames from "classnames";
import { SpectreInputGroupContext } from "./SpectreInputGroup";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  icon: "arrow-up" | "arrow-right" | "arrow-down" | "arrow-left" | "upward" | "forward" | "downward" | "back" | "caret" | "menu" | "apps" | "more-horiz" | "more-vert" | "cross" | "check" | "stop" | "shutdown" | "refresh" | "search" | "flag" | "bookmark" | "edit" | "delete" | "share" | "download" | "upload" | "copy" | "mail" | "people" | "message" | "photo" | "time" | "location" | "link" | "emoji" | "plus"
}

export default class SpectreIcon extends React.PureComponent<Props> {
  render() {
    const { icon, ...nativeProps } = this.props

    return (
      <SpectreInputGroupContext.Consumer>
        {inputGroup => (
          inputGroup ? (
            <span {...nativeProps} className={classNames(`input-group-icon input-group-addon addon-${inputGroup.size}`, nativeProps.className)}>
              <i className={`icon icon-${icon}`} />
            </span>
          ) : (
              <i {...nativeProps} className={`icon icon-${icon}`} />
            )
        )}
      </SpectreInputGroupContext.Consumer>
    )
  }
}
