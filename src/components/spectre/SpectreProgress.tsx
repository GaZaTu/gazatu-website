import * as React from "react";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLProgressElement>, HTMLProgressElement> {
  value?: number
  max?: number
  unit?: string
}

export default class SpectreProgress extends React.PureComponent<Props> {
  render() {
    const { value, max, unit, ...nativeProps } = this.props
    const className = classNames({
      "progress": true,
      "tooltip": (this.props.value !== undefined || this.props.max !== undefined),
    }, nativeProps.className)

    const tooltip = `${this.props.value}${unit ? ` ${unit}` : ""}${this.props.max ? ` / ${this.props.max}${unit ? ` ${unit}` : ""}` : ""}`

    return (
      <progress {...nativeProps} className={className} data-tooltip={tooltip} value={value} max={max} />
    )
  }
}
