import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  initials?: string
  image?: string
  icon?: string
  presence?: "offline" | "online" | "busy" | "away"
}

class SpectreAvatar extends React.PureComponent<Props> {
  render() {
    const { size, initials, image, icon, presence, ...nativeProps } = this.props
    const className = classNames({
      [`avatar`]: true,
      [`avatar-${size}`]: size,
    }, nativeProps.className)

    return (
      <figure {...nativeProps} className={className} data-initial={initials}>
        {image && (<img src={image} />)}
        {icon && (<img src={icon} className="avatar-icon" />)}
        {presence && (<i className={`avatar-presence ${presence}`} />)}
      </figure>
    )
  }
}

export default hot(module)(SpectreAvatar)
