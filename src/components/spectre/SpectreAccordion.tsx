import * as React from "react";
import * as classNames from "classnames";
import { SpectreAccordionGroupContext } from "./SpectreAccordionGroup";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  name?: string
  label: React.ReactNode
  exclusive?: boolean
}

export default class SpectreAccordion extends React.PureComponent<Props> {
  id = Math.random().toString(36).substr(2, 10)

  render() {
    const { children, name, label, exclusive, ...nativeProps } = this.props
    const className = classNames("accordion", nativeProps.className)

    return (
      <SpectreAccordionGroupContext.Consumer>
        {accordionGroup => (
          <div {...nativeProps} className={className}>
            <input type={this.getInputType(exclusive || accordionGroup.exclusive)} id={this.id} name={name || accordionGroup.name} hidden />
            <label className="accordion-header c-hand" htmlFor={this.id}>{label}</label>
            <div className="accordion-body">{children}</div>
          </div>
        )}
      </SpectreAccordionGroupContext.Consumer>
    )
  }

  getInputType(exclusive = this.props.exclusive) {
    return exclusive ? "radio" : "checkbox"
  }
}
