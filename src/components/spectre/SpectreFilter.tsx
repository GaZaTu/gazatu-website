import * as React from "react";
import * as classNames from "classnames";
import SpectreFilterItem from "./SpectreFilterItem";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  asColumns?: boolean
}

export default class SpectreFilter extends React.PureComponent<Props> {
  render() {
    const { children, asColumns, ...nativeProps } = this.props
    const className = classNames("filter", nativeProps.className)
    const tags = new Map<string, string>([["All", "tag-0"]])
    let tagIdx = 1

    const modifiedChildren = React.Children.map(children, child => {
      const elem = child as React.ReactElement<any>
      let propsToAdd = {} as any

      if ((elem.type as any).prototype instanceof SpectreFilterItem) {
        propsToAdd = {
          tag: tags.get(elem.props.tag) || tags.set(elem.props.tag, `tag-${tagIdx++}`).get(elem.props.tag),
        }
      }

      return (
        React.cloneElement(child as React.ReactElement<any>, propsToAdd)
      )
    })

    return (
      <div {...nativeProps} className={className}>
        {[...tags].map(tag => (
          <input key={tag[1]} type="radio" id={tag[1]} className="filter-tag" name="filter-radio" defaultChecked={tag[1] === 'tag-0'} hidden />
        ))}

        <div className="filter-nav">
          {[...tags].map(tag => (
            <label key={tag[1]} className="chip" htmlFor={tag[1]}>{tag[0]}</label>
          ))}
        </div>

        <div className={`filter-body ${asColumns && "columns"}`}>
          {modifiedChildren}
        </div>
      </div>
    )
  }
}
