import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  content?: string
  vertical?: boolean
  textCenter?: boolean
}

class SpectreDivider extends React.PureComponent<Props> {
  render() {
    const { content, vertical, textCenter, ...nativeProps } = this.props
    const className = classNames({
      "divider": !vertical,
      "divider-vert": vertical,
      "text-center": textCenter,
    }, nativeProps.className)

    return (
      <div {...nativeProps} className={className} data-content={content} />
    )
  }
}

export default hot(module)(SpectreDivider)
