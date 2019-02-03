import * as React from "react";
import { hot } from "react-hot-loader";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  inputSize?: ""
  name?: string
  required?: boolean
  value?: any
  error?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

class SpectreRadioGroup extends React.PureComponent<Props> {
  render() {
    const { children, inputSize, name, required, value, error, onChange, ...nativeProps } = this.props

    return (
      <div {...nativeProps}>
        {React.Children.map(children, child => {
          const elem = child as React.ReactElement<any>

          return (
            React.cloneElement(elem, { inputSize, name, checked: (elem.props.value === value), error, onChange, type: "radio" })
          )
        })}
      </div>
    )
  }
}

export default hot(module)(SpectreRadioGroup)
