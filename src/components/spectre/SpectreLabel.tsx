import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
  children?: React.ReactNode
  kind?: "" | "primary" | "secondary" | "success" | "warning" | "error"
  round?: boolean
}

class SpectreLabel extends React.PureComponent<Props> {
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

export default hot(module)(SpectreLabel)
