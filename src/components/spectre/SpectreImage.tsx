import * as React from "react";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  mode?: "responsive" | "fit-contain" | "fit-cover"
  caption?: string
  captionAlignment?: "left" | "center" | "right"
}

export default class SpectreImage extends React.PureComponent<Props> {
  render() {
    const { mode, caption, captionAlignment, className, style, ...nativeProps } = this.props
    const figureClassName = classNames("figure", className)
    const imageClassName = classNames({
      [`img-${mode}`]: mode,
    })
    const captionClassName = classNames({
      [`figure-caption`]: true,
      [`text-${captionAlignment}`]: captionAlignment,
    })

    return (
      <figure className={figureClassName} style={style} >
        <img {...nativeProps} className={imageClassName} />

        {caption && (
          <figcaption className={captionClassName}>{caption}</figcaption>
        )}
      </figure>
    )
  }
}
