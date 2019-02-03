import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

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

class SpectreInput extends React.PureComponent<Props> {
  render() {
    const { inputSize, icon, iconPos, loading, success, error, container, options, onIconClick, ...nativeProps } = this.props

    const containerProps = container || {}

    containerProps.style = Object.assign({}, containerProps.style, {
      display: "flex",
    })

    const containerClassName = classNames({
      [`has-icon-${iconPos || "right"}`]: icon || loading,
    }, containerProps.className)

    const inputClassName = classNames({
      [`form-input`]: true,
      [`input-${inputSize}`]: inputSize,
      [`is-success`]: success,
      [`is-error`]: error,
    }, nativeProps.className)

    const datalistId = Math.random().toString(36).substr(2, 10)
    const datalistElem = (options && (
      <datalist id={datalistId}>
        {options.map(o => (
          <option key={o}>{o}</option>
        ))}
      </datalist>
    ))

    if (icon || loading) {
      return (
        <div {...containerProps} className={containerClassName}>
          <input {...nativeProps} className={inputClassName} list={options ? datalistId : undefined} />
          {icon && (<i className={`form-icon icon icon-${icon} ${onIconClick && "c-hand"}`} onClick={onIconClick} />)}
          {loading && (<i className={`form-icon loading ${onIconClick && "c-hand"}`} onClick={onIconClick} />)}
          {datalistElem}
        </div>
      )
    } else {
      return (
        <React.Fragment>
          <input {...nativeProps} className={inputClassName} list={options ? datalistId : undefined} />
          {datalistElem}
        </React.Fragment>
      )
    }
  }
}

export default hot(module)(SpectreInput)
