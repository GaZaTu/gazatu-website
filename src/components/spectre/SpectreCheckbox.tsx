import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  children?: React.ReactNode
  inputSize?: ""
  type?: "checkbox" | "radio" | "switch"
  label?: React.ReactNode
  error?: boolean
}

class SpectreCheckbox extends React.PureComponent<Props> {
  render() {
    const { children, inputSize, type, label, error, ...nativeProps } = this.props

    const className = classNames({
      [`form-${type || "checkbox"}`]: true,
      [`is-error`]: error,
    })

    return (
      <label className={className}>
        <input {...nativeProps} type={(type === "radio") ? "radio" : "checkbox"} />
        <i className="form-icon" />
        {label}
      </label>
    )
  }
}

export default hot(module)(SpectreCheckbox)
