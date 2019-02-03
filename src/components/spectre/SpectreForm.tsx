import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";
import SpectreFormGroup from "./SpectreFormGroup";
import { reactNodeIsComponent } from "../../utils";

interface Props extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  children?: React.ReactNode
  horizontal?: boolean
  getPropsForChild?: (node: React.ReactNode) => any
}

class SpectreForm extends React.PureComponent<Props> {
  render() {
    const { children, horizontal, getPropsForChild, ...nativeProps } = this.props
    const className = classNames({
      "form-horizontal": horizontal,
    }, nativeProps.className)

    if (!nativeProps.onSubmit) {
      nativeProps.onSubmit = event => {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    return (
      <form {...nativeProps} className={className}>
        {React.Children.map(children, child => {
          const elem = child as React.ReactElement<any>
          const props = this.getPropsForChild(elem)

          if (props) {
            return React.cloneElement(elem, props)
          } else {
            return elem
          }
        })}
      </form>
    )
  }

  getPropsForChild(node: React.ReactNode) {
    if (reactNodeIsComponent(node, SpectreFormGroup)) {
      return {
        horizontal: node.props.horizontal || this.props.horizontal,
      }
    } else if (this.props.getPropsForChild) {
      return this.props.getPropsForChild(node)
    } else {
      return null
    }
  }
}

export default hot(module)(SpectreForm)
