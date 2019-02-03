import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  kind?: "default" | "primary" | "link" | "success" | "error"
  size?: "sm" | "md" | "lg" | "block"
  shape?: "square" | "circle"
  loading?: boolean
  badge?: string
}

class SpectreButton extends React.PureComponent<Props> {
  render() {
    const { kind, size, shape, loading, badge, children, ...nativeProps } = this.props
    const className = classNames({
      [`btn`]: true,
      [`btn-${kind}`]: kind,
      [`btn-${size}`]: size,
      [`btn-action`]: shape,
      [`s-circle`]: shape === "circle",
      [`loading`]: loading,
      [`badge`]: badge !== undefined,
    }, nativeProps.className)

    return (
      <button {...nativeProps} className={className} data-badge={badge}>
        {children}
      </button>
    )
  }
}

export default hot(module)(SpectreButton)
