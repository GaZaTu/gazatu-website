import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";
import SpectreInput from "./SpectreInput";
import SpectreSelect from "./SpectreSelect";
import SpectreButton from "./SpectreButton";
import { reactNodeIsComponent } from "../../utils";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  size?: "sm" | "md" | "lg"
  getPropsForChild?: (node: React.ReactNode) => any
}

class SpectreInputGroup extends React.PureComponent<Props> {
  render() {
    const { children, size, getPropsForChild, ...nativeProps } = this.props
    const className = classNames("input-group", nativeProps.className)

    return (
      <div {...nativeProps} className={className}>
        {React.Children.map(children, child => {
          const elem = child as React.ReactElement<any>
          const props = this.getPropsForChild(elem)

          if (props) {
            return React.cloneElement(elem, props)
          } else {
            return elem
          }
        })}
      </div>
    )
  }

  getPropsForChild(node: React.ReactNode) {
    const { size, getPropsForChild } = this.props

    if ((node as any).type === "span") {
      return {
        className: classNames("input-group-addon", { [`addon-${size}`]: size }, (node as any).props.className),
      }
    } else if (reactNodeIsComponent(node, SpectreInput)) {
      return {
        inputSize: size,
      }
    } else if (reactNodeIsComponent(node, SpectreSelect)) {
      return {
        inputSize: size,
      }
    } else if (reactNodeIsComponent(node, SpectreButton)) {
      return {
        className: classNames("input-group-btn", node.props.className),
        size: size,
      }
    } else if (getPropsForChild) {
      return getPropsForChild(node)
    } else {
      return null
    }
  }
}

export default hot(module)(SpectreInputGroup)
