import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  children?: React.ReactNode
  inputSize?: "sm" | "md" | "lg"
  success?: boolean
  error?: boolean
}

class SpectreSelect extends React.PureComponent<Props> {
  render() {
    const { children, inputSize, success, error, ...nativeProps } = this.props
    const className = classNames({
      [`form-select`]: true,
      [`select-${inputSize}`]: inputSize,
      [`is-success`]: success,
      [`is-error`]: error,
    }, nativeProps.className)

    return (
      <select {...nativeProps} className={className}>
        {children}
      </select>
    )
  }
}

export default hot(module)(SpectreSelect)
