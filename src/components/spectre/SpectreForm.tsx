import * as React from "react";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  children?: React.ReactNode
  size?: "sm" | "md" | "lg"
  horizontal?: boolean
}

export default class SpectreForm extends React.PureComponent<Props> {
  id = Math.random().toString(36).substr(2, 10)
  consumedId = false

  render() {
    const { children, size, horizontal, ...nativeProps } = this.props
    const className = classNames({
      "form-horizontal": horizontal,
    }, nativeProps.className)

    return (
      <SpectreFormContext.Provider value={{ size, horizontal }}>
        <form {...nativeProps} className={className}>
          {children}
        </form>
      </SpectreFormContext.Provider>
    )
  }
}

interface Context {
  size?: Props["size"]
  horizontal?: boolean
}

export const SpectreFormContext = React.createContext<Context | undefined>(undefined)
