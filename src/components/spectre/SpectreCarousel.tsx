import * as React from "react";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  autoNavigationInterval?: number
  hideNavigation?: boolean
}

interface State {
  currentIdx: number
}

export default class SpectreCarousel extends React.PureComponent<Props, State> {
  intervalHandle?: number

  constructor(props: Props) {
    super(props)

    this.state = {
      currentIdx: 0,
    }
  }

  get count() {
    return React.Children.count(this.props.children)
  }

  resetInterval() {
    clearTimeout(this.intervalHandle)

    if (this.props.autoNavigationInterval) {
      this.intervalHandle = setTimeout(() => this.navigateToNext(), this.props.autoNavigationInterval)
    }
  }

  navigate(target: number) {
    this.setState({ currentIdx: target })
    this.resetInterval()
  }

  navigateToPrev = () => {
    this.navigate(this.state.currentIdx === 0 ? this.count - 1 : this.state.currentIdx - 1)
  }

  navigateToNext = () => {
    this.navigate(this.state.currentIdx === this.count - 1 ? 0 : this.state.currentIdx + 1)
  }

  componentDidMount() {
    this.resetInterval()
  }

  componentWillUnmount() {
    clearTimeout(this.intervalHandle)
  }

  render() {
    const { children, autoNavigationInterval, hideNavigation, ...nativeProps } = this.props
    const className = classNames("carousel", nativeProps.className)
    const name = Math.random().toString(36).substr(2, 10)

    return (
      <div {...nativeProps} className={className}>
        {React.Children.map(children, (_, i) => (
          <input className="carousel-locator" type="radio" name={name} checked={i === this.state.currentIdx} hidden readOnly />
        ))}

        <div className="carousel-container">
          {React.Children.map(children, (child, i) => (
            <figure className="carousel-item">
              {!hideNavigation && (
                <React.Fragment>
                  <label className="item-prev btn btn-action btn-lg" onClick={this.navigateToPrev}>
                    <i className="icon icon-arrow-left" />
                  </label>
                  <label className="item-next btn btn-action btn-lg" onClick={this.navigateToNext}>
                    <i className="icon icon-arrow-right" />
                  </label>
                </React.Fragment>
              )}
              {child}
            </figure>
          ))}
        </div>

        {!hideNavigation && (
          <div className="carousel-nav">
            {React.Children.map(children, (_, i) => (
              <label className="nav-item text-hide c-hand" onClick={() => this.navigate(i)}>{i}</label>
            ))}
          </div>
        )}
      </div>
    )
  }
}
