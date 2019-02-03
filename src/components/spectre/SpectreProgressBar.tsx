import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  value: number
  max: number
  size?: "sm" | "md"
}

class SpectreProgressBar extends React.PureComponent<Props> {
  render() {
    const { value, max, size, ...nativeProps } = this.props
    const className = classNames({
      [`bar`]: true,
      [`bar-${size}`]: size,
    }, nativeProps.className)
    const width = `${(value * 100) / max}%`

    return (
      <div className={className}>
        <div className="bar-item tooltip" style={{ width }} data-tooltip={width}>{(size !== "sm") && width}</div>
      </div>
    )
  }
}

export default hot(module)(SpectreProgressBar)
