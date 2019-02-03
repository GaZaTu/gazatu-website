import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
  children?: React.ReactNode
}

class SpectreMenu extends React.PureComponent<Props> {
  render() {
    const { children, ...nativeProps } = this.props
    const className = classNames("menu", nativeProps.className)

    return (
      <ul {...nativeProps} className={className}>{children}</ul>
    )
  }
}

export default hot(module)(SpectreMenu)
