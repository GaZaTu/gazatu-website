import * as React from "react";
import * as classNames from "classnames";
import { SpectreRadioGroupContext } from "./SpectreRadioGroup";

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  children?: React.ReactNode
  type?: "checkbox" | "radio" | "switch"
  label?: React.ReactNode
  error?: boolean
}

export default class SpectreCheckbox extends React.PureComponent<Props> {
  render() {
    const { children, type, label, error, ...nativeProps } = this.props

    return (
      <SpectreRadioGroupContext.Consumer>
        {radioGroup => (
          <label className={this.getClassName(radioGroup)}>
            <input {...nativeProps} type={this.getInputType(radioGroup)} checked={this.getChecked(radioGroup)} onChange={this.getOnChange(radioGroup)} className="" />
            <i className="form-icon" />
            {label}
          </label>
        )}
      </SpectreRadioGroupContext.Consumer>
    )
  }

  getClassName(radioGroup: React.ContextType<typeof SpectreRadioGroupContext>) {
    const { type, error, ...nativeProps } = this.props

    return classNames({
      [`form-${type || (radioGroup && "radio") || "checkbox"}`]: true,
      [`is-error`]: error,
    }, nativeProps.className)
  }

  getInputType(radioGroup: React.ContextType<typeof SpectreRadioGroupContext>) {
    return (radioGroup || this.props.type === "radio") ? "radio" : "checkbox"
  }

  getChecked(radioGroup: React.ContextType<typeof SpectreRadioGroupContext>) {
    return this.props.checked || (radioGroup && radioGroup.value === this.props.value)
  }

  getOnChange(radioGroup: React.ContextType<typeof SpectreRadioGroupContext>) {
    return this.props.onChange || (radioGroup && radioGroup.onChange)
  }
}
