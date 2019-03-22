import * as React from "react";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  tag: string
}

export default class SpectreFilterItem extends React.PureComponent<Props> {
  render() {
    const { children, tag, ...nativeProps } = this.props
    const className = classNames("filter-item", nativeProps.className)

    return (
      <div {...nativeProps} className={className} data-tag={tag}>
        {children}
      </div>
    )
  }
}
