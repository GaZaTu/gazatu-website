import * as React from "react";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  value?: any
  error?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default class SpectreRadioGroup extends React.PureComponent<Props> {
  render() {
    const { children, value, error, onChange, ...nativeProps } = this.props

    return (
      <SpectreRadioGroupContext.Provider value={{ value, onChange, error }}>
        <div {...nativeProps}>
          {children}
        </div>
      </SpectreRadioGroupContext.Provider>
    )
  }
}

interface Context {
  value?: any
  error?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const SpectreRadioGroupContext = React.createContext<Context | undefined>(undefined)
