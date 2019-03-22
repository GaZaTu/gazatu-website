import * as React from "react";
import * as classNames from "classnames";
import { SpectreInputGroupContext } from "./SpectreInputGroup";
import { SpectreFormGroupContext } from "./SpectreFormGroup";

interface Props extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  children?: React.ReactNode
  inputSize?: "sm" | "md" | "lg"
  success?: boolean
  error?: boolean
}

export default class SpectreSelect extends React.PureComponent<Props> {
  render() {
    const { children, inputSize, success, error, ...nativeProps } = this.props

    return (
      <SpectreFormGroupContext.Consumer>
        {formGroup => (
          <SpectreInputGroupContext.Consumer>
            {inputGroup => (
              <select {...nativeProps} className={this.getClassName(inputGroup, formGroup)} id={nativeProps.id || (formGroup && formGroup.id)}>
                {children}
              </select>
            )}
          </SpectreInputGroupContext.Consumer>
        )}
      </SpectreFormGroupContext.Consumer>
    )
  }

  getClassName(inputGroup: React.ContextType<typeof SpectreInputGroupContext>, formGroup: React.ContextType<typeof SpectreFormGroupContext>) {
    let { inputSize, success, error, ...nativeProps } = this.props

    inputSize = inputSize || (inputGroup && inputGroup.size) || (formGroup && formGroup.size)

    return classNames({
      [`form-select`]: true,
      [`select-${inputSize}`]: inputSize,
      [`is-success`]: success,
      [`is-error`]: error,
    }, nativeProps.className)
  }
}
