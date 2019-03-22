import * as React from "react";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  component?: React.ReactNode
}

export default class SpectrePopover extends React.PureComponent<Props> {
  render() {
    const { children, position, component, ...nativeProps } = this.props
    const className = classNames({
      [`popover`]: true,
      [`popover-${position}`]: position,
    }, nativeProps.className)

    return (
      <div {...nativeProps} className={className}>
        {component}
        <div className="popover-container">
          {children}
        </div>
      </div>
    )
  }
}
