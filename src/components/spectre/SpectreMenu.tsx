import * as React from "react";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
  children?: React.ReactNode
}

export default class SpectreMenu extends React.PureComponent<Props> {
  render() {
    const { children, ...nativeProps } = this.props
    const className = classNames("menu", nativeProps.className)

    return (
      <ul {...nativeProps} className={className}>{children}</ul>
    )
  }
}
