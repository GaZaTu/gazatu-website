import * as React from "react";
import { hot } from "react-hot-loader";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  exclusive?: boolean
}

class SpectreAccordionContainer extends React.PureComponent<Props> {
  render() {
    const { children, exclusive, ...nativeProps } = this.props
    const name = Math.random().toString(36).substr(2, 10)

    return (
      <div {...nativeProps}>
        {React.Children.map(children, child =>
          React.cloneElement(child as React.ReactElement<any>, { name, exclusive })
        )}
      </div>
    )
  }
}

export default hot(module)(SpectreAccordionContainer)
