import * as React from "react";
import * as classNames from "classnames";
import { SpectreFormContext } from "./SpectreForm";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  size?: "sm" | "md" | "lg"
  label?: React.ReactNode
  hint?: React.ReactNode
  success?: boolean
  error?: boolean
  horizontal?: boolean
}

export default class SpectreFormGroup extends React.PureComponent<Props> {
  id = Math.random().toString(36).substr(2, 10)
  consumedId = false

  render() {
    const { children, size, label, hint, success, error, horizontal, ...nativeProps } = this.props
    const className = classNames({
      "form-group": true,
      "has-success": success,
      "has-error": error,
    }, nativeProps.className)

    return (
      <SpectreFormContext.Consumer>
        {form => (
          <SpectreFormGroupContext.Provider value={this.provideContext(form)}>
            <div {...nativeProps} className={className}>
              {this.getInnerNodes(form)}
            </div>
          </SpectreFormGroupContext.Provider>
        )}
      </SpectreFormContext.Consumer>
    )
  }

  provideContext(form: React.ContextType<typeof SpectreFormContext>) {
    return {
      id: this.id,
      size: this.props.size || (form && form.size),
    }
  }

  getInnerNodes(form: React.ContextType<typeof SpectreFormContext>) {
    let { children, size, label, hint, horizontal } = this.props

    size = size || (form && form.size)
    horizontal = horizontal || (form && form.horizontal)

    const labelNode = label && (
      <label className={`form-label label-${size}`} htmlFor={this.id}>{label}</label>
    )

    const hintNode = (cls: string) => (
      hint && (
        <span className={`form-input-hint input-${size} ${cls}`}>{hint}</span>
      )
    )

    if (horizontal) {
      return (
        <React.Fragment>
          <div className="col-3 col-sm-12">
            {labelNode}
          </div>
          <div className="col-9 col-sm-12">
            {children}
            {hintNode("")}
          </div>
          {/* <div className="col-3 col-sm-12">
            {hintNode("form-checkbox")}
          </div> */}
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          {labelNode}
          {children}
          {hintNode("")}
        </React.Fragment>
      )
    }
  }
}

interface Context {
  id?: string
  size?: Props["size"]
}

export const SpectreFormGroupContext = React.createContext<Context | undefined>(undefined)
