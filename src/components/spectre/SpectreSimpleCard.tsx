import * as React from "react";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  cardTitle?: React.ReactNode
  cardSubtitle?: React.ReactNode
  cardFooter?: React.ReactNode
}

export default class SpectreSimpleCard extends React.PureComponent<Props> {
  render() {
    const { children, cardTitle, cardSubtitle, cardFooter, ...nativeProps } = this.props
    const className = classNames("card", nativeProps.className)

    return (
      <div {...nativeProps} className={className}>
        <div className="card-header">
          {cardTitle && (
            <div className="card-title text-bold">{cardTitle}</div>
          )}
          {cardSubtitle && (
            <div className="card-subtitle text-gray">{cardSubtitle}</div>
          )}
        </div>
        <div className="card-body">
          {children}
        </div>
        <div className="card-footer">
          {cardFooter}
        </div>
      </div>
    )
  }
}
