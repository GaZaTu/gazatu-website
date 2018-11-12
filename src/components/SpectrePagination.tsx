import * as React from "react";
import { hot } from "react-hot-loader";
import { Subscription, hotkey } from "../utils";

function range(start: number, end: number) {
  const res = [] as number[]

  for (let i = start; i < end; i++) {
    res.push(i)
  }

  return res
}

interface RenderItemState {
  addedLeftFiller: boolean
  addedRightFiller: boolean
}

interface Props {
  pageCount: number
  page: number
  onChange: (page: number) => any
  disabled?: boolean
  hotkeys?: boolean
}

class SpectrePagination extends React.PureComponent<Props> {
  subscriptions = [] as Subscription[]

  componentDidMount() {
    this.subscriptions.push(
      hotkey("ArrowLeft", () => {
        if (this.props.page > 0) {
          this.props.onChange(this.props.page - 1)
        }
      }),
      hotkey("ArrowRight", () => {
        if ((this.props.page + 1) < this.props.pageCount) {
          this.props.onChange(this.props.page + 1)
        }
      }),
    )
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  render() {
    const renderItemState: RenderItemState = {
      addedLeftFiller: false,
      addedRightFiller: false,
    }

    if (this.props.pageCount === 0) {
      return null
    }

    return (
      <ul className="pagination">
        {this.renderItem("prev", "Prev", this.props.page - 1, false, this.props.page + 1 === 1)}
        {range(1, this.props.pageCount + 1).map(i => this.renderPageItem(i, renderItemState))}
        {this.renderItem("next", "Next", this.props.page + 1, false, this.props.page + 1 === this.props.pageCount)}
      </ul>
    )
  }

  renderPageItem(i: number, state: RenderItemState) {
    const pageCount = this.props.pageCount
    const pageNumber = this.props.page + 1

    if (i === pageNumber || (i > pageNumber - 2 && i < pageNumber) || (i > pageNumber && i < pageNumber + 2) || i === 1 || i === pageCount) {
      return this.renderItem(i, i, i - 1, i === pageNumber, false)
    } else if ((i < pageNumber && !state.addedLeftFiller) || (i > pageNumber && !state.addedRightFiller)) {
      state.addedLeftFiller = (i < pageNumber)
      state.addedRightFiller = (i > pageNumber)

      return (
        <li key={i} className="page-item">
          <span>...</span>
        </li>
      )
    } else {
      return null
    }
  }

  renderItem(key: string | number, text: string | number, onClickTarget: number, active: boolean, disabled: boolean) {
    return (
      <li key={key} className={`page-item ${active ? "active" : ""} ${disabled ? "disabled" : ""}`}>
        <a style={{ cursor: "pointer" }} onClick={() => this.props.onChange(onClickTarget)}>{text}</a>
      </li>
    )
  }
}

export default hot(module)(SpectrePagination)
