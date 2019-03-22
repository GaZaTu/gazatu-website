import * as React from "react";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  text?: string
}

export default class SpectreMenuDivider extends React.PureComponent<Props> {
  render() {
    const { text, ...nativeProps } = this.props
    const className = classNames("divider", nativeProps.className)

    return (
      <li {...nativeProps} className={className} data-content={text} />
    )
  }
}
