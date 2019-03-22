import * as React from "react";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
  children?: React.ReactNode
  kind?: "" | "primary" | "secondary" | "success" | "warning" | "error"
  round?: boolean
}

export default class SpectreLabel extends React.PureComponent<Props> {
  render() {
    const { children, kind, round, ...nativeProps } = this.props
    const className = classNames({
      [`label`]: true,
      [`label-${kind}`]: kind,
      [`label-rounded`]: round,
    }, nativeProps.className)

    return (
      <label {...nativeProps} className={className}>{children}</label>
    )
  }
}
