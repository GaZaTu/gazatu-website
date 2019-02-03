import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  name?: string
  label: React.ReactNode
  exclusive?: boolean
}

class SpectreAccordion extends React.PureComponent<Props> {
  render() {
    const { children, name, label, exclusive, ...nativeProps } = this.props
    const className = classNames("accordion", nativeProps.className)
    const inputType = exclusive ? "radio" : "checkbox"
    const id = Math.random().toString(36).substr(2, 10)

    return (
      <div {...nativeProps} className={className}>
        <input type={inputType} id={id} name={name} hidden />
        <label className="accordion-header c-hand" htmlFor={id}>{label}</label>
        <div className="accordion-body">{children}</div>
      </div>
    )
  }
}

export default hot(module)(SpectreAccordion)
