import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  size?: "sm" | "md" | "lg"
  label?: React.ReactNode
  hint?: React.ReactNode
  success?: boolean
  error?: boolean
  horizontal?: boolean
}

class SpectreFormGroup extends React.PureComponent<Props> {
  render() {
    const { children, size, label, hint, success, error, horizontal, ...nativeProps } = this.props
    const className = classNames({
      "form-group": true,
      "has-success": success,
      "has-error": error,
    }, nativeProps.className)
    const id = Math.random().toString(36).substr(2, 10)

    const labelNode = () => (label && (<label className={`form-label label-${size}`} htmlFor={id}>{label}</label>))
    const childrenNode = () => ((React.Children.count(children) === 1) ? React.Children.map(children, child =>
      React.cloneElement(child as React.ReactElement<any>, { id, inputSize: size })
    ) : children)
    const hintNode = (cls: string) => (hint && (<span className={`form-input-hint input-${size} ${cls}`}>{hint}</span>))

    if (horizontal) {
      return (
        <div {...nativeProps} className={className}>
          <div className="col-3 col-sm-12">
            {labelNode()}
          </div>
          <div className="col-6 col-sm-12">
            {childrenNode()}
          </div>
          <div className="col-3 col-sm-12">
            {hintNode("form-checkbox")}
          </div>
        </div>
      )
    } else {
      return (
        <div {...nativeProps} className={className}>
          {labelNode()}
          {childrenNode()}
          {hintNode("")}
        </div>
      )
    }
  }
}

export default hot(module)(SpectreFormGroup)
