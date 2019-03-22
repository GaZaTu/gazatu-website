import * as React from "react";
import * as classNames from "classnames";
import { SpectreInputGroupContext } from "./SpectreInputGroup";

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  children?: React.ReactNode
  kind?: "default" | "primary" | "link" | "success" | "error"
  size?: "sm" | "md" | "lg"
  shape?: "square" | "circle"
  loading?: boolean
  block?: boolean
  badge?: string
  href?: string
  target?: string
}

export default class SpectreButton extends React.PureComponent<Props> {
  render() {
    const { children, kind, size, shape, loading, block, badge, href, target, ...nativeProps } = this.props

    return (
      <SpectreInputGroupContext.Consumer>
        {inputGroup => (
          href ? (
            <a {...(nativeProps as any)} className={this.getClassName(inputGroup)} data-badge={badge} hreF={href} target={target}>
              {children}
            </a>
          ) : (
              <button {...nativeProps} className={this.getClassName(inputGroup)} data-badge={badge}>
                {children}
              </button>
            )
        )}
      </SpectreInputGroupContext.Consumer>
    )
  }

  getClassName(inputGroup: React.ContextType<typeof SpectreInputGroupContext>) {
    let { kind, size, shape, loading, block, badge, ...nativeProps } = this.props

    size = size || (inputGroup && inputGroup.size)

    return classNames({
      [`btn`]: true,
      [`btn-${kind}`]: kind,
      [`btn-${size}`]: size,
      [`btn-block`]: block,
      [`btn-action`]: shape,
      [`s-circle`]: shape === "circle",
      [`loading`]: loading,
      [`badge`]: badge !== undefined,
      [`input-group-btn`]: inputGroup,
    }, nativeProps.className)
  }
}
