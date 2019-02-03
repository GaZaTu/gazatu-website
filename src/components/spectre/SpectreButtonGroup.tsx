import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  block?: boolean
}

class SpectreButtonGroup extends React.PureComponent<Props> {
  render() {
    const { children, block, ...nativeProps } = this.props
    const className = classNames({
      "btn-group": true,
      "btn-group-block": block,
    }, nativeProps.className)

    return (
      <div {...nativeProps} className={className}>{children}</div>
    )
  }
}

export default hot(module)(SpectreButtonGroup)
