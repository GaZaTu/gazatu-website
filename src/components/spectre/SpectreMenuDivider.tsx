import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  content?: string
}

class SpectreMenuDivider extends React.PureComponent<Props> {
  render() {
    const { content, ...nativeProps } = this.props
    const className = classNames("divider", nativeProps.className)

    return (
      <li {...nativeProps} className={className} data-content={content} />
    )
  }
}

export default hot(module)(SpectreMenuDivider)
