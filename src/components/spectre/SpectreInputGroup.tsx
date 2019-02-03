import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";
import SpectreInput from "./SpectreInput";
import SpectreSelect from "./SpectreSelect";
import SpectreButton from "./SpectreButton";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  size?: "sm" | "md" | "lg"
  getPropsForChild?: (elem: React.ReactElement<any>, prototype: any) => any
}

class SpectreInputGroup extends React.PureComponent<Props> {
  render() {
    const { children, size, getPropsForChild, ...nativeProps } = this.props
    const className = classNames("input-group", nativeProps.className)

    return (
      <div {...nativeProps} className={className}>
        {React.Children.map(children, child => {
          const elem = child as React.ReactElement<any>
          const props = this.getPropsForChild(elem, (elem.type as any).prototype)

          if (props) {
            return React.cloneElement(elem, props)
          } else {
            return elem
          }
        })}
      </div>
    )
  }

  getPropsForChild(elem: React.ReactElement<any>, prototype: any) {
    const { size, getPropsForChild } = this.props

    if (elem.type === "span") {
      return {
        className: classNames("input-group-addon", { [`addon-${size}`]: size }, elem.props.className),
      }
    } else if (prototype instanceof SpectreInput) {
      return {
        inputSize: size,
      }
    } else if (prototype instanceof SpectreSelect) {
      return {
        inputSize: size,
      }
    } else if (prototype instanceof SpectreButton) {
      return {
        className: classNames("input-group-btn", elem.props.className),
        size: size,
      }
    } else if (getPropsForChild) {
      return getPropsForChild(elem, prototype)
    } else {
      return null
    }
  }
}

export default hot(module)(SpectreInputGroup)
