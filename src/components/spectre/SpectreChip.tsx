import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  avatarImage?: string
  avatarInitials?: string
  avatarStyle?: React.CSSProperties

  onClose?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => any
}

class SpectreChip extends React.PureComponent<Props> {
  render() {
    const { children, avatarImage, avatarInitials, avatarStyle, onClose, ...nativeProps } = this.props
    const className = classNames("chip", nativeProps.className)

    return (
      <div {...nativeProps} className={className}>
        {avatarImage && (<img className="avatar avatar-sm" src={avatarImage} />)}
        {avatarInitials && (<figure className="avatar avatar-sm" data-initial={avatarInitials} style={avatarStyle} />)}
        {children}
        {onClose && (<a className="btn btn-clear" onClick={onClose} />)}
      </div>
    )
  }
}

export default hot(module)(SpectreChip)
