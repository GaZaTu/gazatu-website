import * as React from "react";
import * as classNames from "classnames";
import { SpectreInputGroupContext } from "./SpectreInputGroup";
import { SpectreFormGroupContext } from "./SpectreFormGroup";

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  inputSize?: "sm" | "md" | "lg"
  icon?: string
  iconPos?: "left" | "right"
  loading?: boolean
  success?: boolean
  error?: boolean
  container?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  options?: string[]
  onIconClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default class SpectreInput extends React.PureComponent<Props> {
  render() {
    const { inputSize, icon, iconPos, loading, success, error, container, options, onIconClick, ...nativeProps } = this.props

    const containerProps = container || {}
    const containerClassName = classNames({
      [`form-custom-input`]: true,
      [`has-icon-${iconPos || "right"}`]: icon || loading,
    }, containerProps.className)

    const datalistId = Math.random().toString(36).substr(2, 10)
    const datalistElem = (options && (
      <datalist id={datalistId}>
        {options.map(o => (
          <option key={o}>{o}</option>
        ))}
      </datalist>
    ))

    return (
      <SpectreFormGroupContext.Consumer>
        {formGroup => (
          <SpectreInputGroupContext.Consumer>
            {inputGroup => (
              <div {...containerProps} className={containerClassName}>
                <input {...nativeProps} className={this.getClassName(inputGroup, formGroup)} id={nativeProps.id || (formGroup && formGroup.id)} />
                {icon && (<i className={`form-icon icon icon-${icon} ${onIconClick && "c-hand"}`} onClick={onIconClick} />)}
                {loading && (<i className={`form-icon loading ${onIconClick && "c-hand"}`} onClick={onIconClick} />)}
                {datalistElem}
              </div>
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
      [`form-input`]: true,
      [`input-${inputSize}`]: inputSize,
      [`is-success`]: success,
      [`is-error`]: error,
    }, nativeProps.className)
  }
}
