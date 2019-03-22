import * as React from "react";
import * as classNames from "classnames";
import { SpectreFormGroupContext } from "./SpectreFormGroup";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  size?: "sm" | "md" | "lg"
}

export default class SpectreInputGroup extends React.PureComponent<Props> {
  render() {
    const { children, size, ...nativeProps } = this.props
    const className = classNames("input-group", nativeProps.className)

    return (
      <SpectreFormGroupContext.Consumer>
        {formGroup => (
          <SpectreInputGroupContext.Provider value={{ size: size || (formGroup && formGroup.size) }}>
            <div {...nativeProps} className={className}>
              {React.Children.map(children, child => {
                const elem = child as React.ReactElement<any>

                if (elem.type === "span") {
                  return React.cloneElement(child as React.ReactElement<any>, {
                    className: classNames("input-group-addon", { [`addon-${size}`]: size }, elem.props.className),
                  })
                }

                return child
              })}
            </div>
          </SpectreInputGroupContext.Provider>
        )}
      </SpectreFormGroupContext.Consumer>
    )
  }
}

interface Context {
  size?: Props["size"]
}

export const SpectreInputGroupContext = React.createContext<Context | undefined>(undefined)
