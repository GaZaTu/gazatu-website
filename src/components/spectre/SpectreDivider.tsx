import * as React from "react";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  text?: string
  vertical?: boolean
  textAlign?: "left" | "center" | "right"
}

export default class SpectreDivider extends React.PureComponent<Props> {
  render() {
    const { text, vertical, textAlign, ...nativeProps } = this.props
    const className = classNames({
      "divider": !vertical,
      "divider-vert": vertical,
      [`text-${textAlign}`]: textAlign,
    }, nativeProps.className)

    return (
      <div {...nativeProps} className={className} data-content={text} />
    )
  }
}
