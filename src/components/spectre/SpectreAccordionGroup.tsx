import * as React from "react";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  exclusive?: boolean
}

export default class SpectreAccordionGroup extends React.PureComponent<Props> {
  render() {
    const { children, exclusive, ...nativeProps } = this.props
    const name = Math.random().toString(36).substr(2, 10)

    return (
      <SpectreAccordionGroupContext.Provider value={{ name, exclusive }}>
        <div {...nativeProps}>
          {children}
        </div>
      </SpectreAccordionGroupContext.Provider>
    )
  }
}

export const SpectreAccordionGroupContext = React.createContext({
  name: "" as string,
  exclusive: false as boolean | undefined,
})
