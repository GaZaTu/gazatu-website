import * as React from "react";
import { hot } from "react-hot-loader";

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  color?: "" | "primary" | "link" | "success" | "error"
  size?: "" | "sm" | "lg" | "block"
  shape?: "" | "square" | "circle"
  loading?: boolean
  badge?: string
}

interface State {

}

class SpectreButton extends React.PureComponent<Props, State> {
  render() {
    const { color, size, shape, loading, badge, ...buttonProps } = this.props
    const className = `
      btn
      ${color ? `btn-${color}` : ""}
      ${size ? `btn-${size}` : ""}
      ${shape ? `btn-action ${shape === "circle" ? "s-circle" : ""}` : ""}
      ${loading ? "loading" : ""}
      ${badge !== undefined ? "badge" : ""}
    `

    return (
      <button {...buttonProps} className={className} data-badge={badge}>
        {this.props.children}
      </button>
    )
  }
}

export default hot(module)(SpectreButton)
