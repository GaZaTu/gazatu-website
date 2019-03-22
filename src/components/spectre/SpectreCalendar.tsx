import * as React from "react";
import * as classNames from "classnames";

export interface SpectreCalendarDateItem {
  key?: string | number
  date: Date
  dateStr: string
  number: number
  today?: boolean
  tooltip?: string
  disabled?: boolean
  prevMonth?: boolean
  nextMonth?: boolean
  selected?: boolean
}

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  size?: "md" | "lg"
  dates?: { date: Date, tooltip?: string, badge?: string, disabled?: boolean, events?: React.ReactNode }[]
  ranges?: { start: Date, end: Date }[]
  value?: string
  valueAsDate?: Date
  onDateClick?: (date: SpectreCalendarDateItem, event: React.MouseEvent) => any
  onDateContextMenu?: (date: SpectreCalendarDateItem, event: React.MouseEvent) => any
}

interface State {
  month: Date,
  navigated: boolean
}

export default class SpectreCalendar extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      month: this.props.valueAsDate || (this.props.value ? new Date(this.props.value) : undefined) || new Date(),
      navigated: false,
    }
  }

  static getDerivedStateFromProps(props: Props, prevState: State): Partial<State> | null {
    if (!prevState.navigated) {
      return {
        month: props.valueAsDate || (props.value ? new Date(props.value) : undefined) || new Date(),
      }
    }

    return null
  }

  handlePrevMonthClick = () => {
    const month = new Date(this.state.month)
    month.setMonth(month.getMonth() - 1)
    this.setState({ month, navigated: true })
  }

  handleNextMonthClick = () => {
    const month = new Date(this.state.month)
    month.setMonth(month.getMonth() + 1)
    this.setState({ month, navigated: true })
  }

  handleDateItemClick = (date: SpectreCalendarDateItem, ev: React.MouseEvent) => {
    if (this.props.onDateClick) {
      this.props.onDateClick(date, ev)
    }
  }

  handleDateItemContextMenu = (date: SpectreCalendarDateItem, ev: React.MouseEvent) => {
    if (this.props.onDateContextMenu) {
      this.props.onDateContextMenu(date, ev)
    }
  }

  render() {
    const { children, value, valueAsDate, onDateClick, onDateContextMenu, ...nativeProps } = this.props
    const className = classNames("calendar", nativeProps.className)

    return (
      <div {...nativeProps} className={className}>
        <div className="calendar-nav navbar">
          <button className="btn btn-action btn-link btn-lg" onClick={this.handlePrevMonthClick}>
            <i className="icon icon-arrow-left" />
          </button>
          <div className="navbar-primary">{this.currentMonth}</div>
          <button className="btn btn-action btn-link btn-lg" onClick={this.handleNextMonthClick}>
            <i className="icon icon-arrow-right" />
          </button>
        </div>

        <div className="calendar-container">
          <div className="calendar-header">
            {this.weekdays.map(d => (
              <div key={d} className="calendar-date">{d}</div>
            ))}
          </div>

          <div className="calendar-body">
            {this.dateItems.map(date => (
              <div key={date.key} className={`calendar-date ${!date.prevMonth || "prev-month"} ${!date.nextMonth || "next-month"}`}>
                <button className={`date-item ${!date.today || "date-today"}`} onClick={ev => this.handleDateItemClick(date, ev)} onContextMenu={ev => this.handleDateItemContextMenu(date, ev)} style={{ background: date.selected ? "lightblue" : undefined }}>{date.number}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  get dateItems() {
    const result = [] as SpectreCalendarDateItem[]
    const today = new Date()
    const month = this.state.month
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1, 12)
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0, 12)
    const firstWeekday = (firstDay.getDay() || 7) - 1
    const LastWeekday = 7 - ((lastDay.getDay() || 7) - 1)

    let date = new Date(firstDay)

    date.setDate(date.getDate() - firstWeekday)

    for (let i = (0 - firstWeekday); i < (lastDay.getDate() - 1 + LastWeekday); i++) {
      result.push({
        key: i,
        date: new Date(date),
        dateStr: date.toISOString().slice(0, date.toISOString().indexOf("T")),
        number: date.getDate(),
        today: date.toDateString() === today.toDateString(),
        prevMonth: i < 0,
        nextMonth: i > (lastDay.getDate() - 1),
        selected: this.valueAsDate && (date.toDateString() === this.valueAsDate.toDateString()),
      })
      date.setDate(date.getDate() + 1)
    }

    return result
  }

  get currentMonth() {
    const formatter = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long" })

    return formatter.format(this.state.month)
  }

  get weekdays() {
    const formatter = new Intl.DateTimeFormat(undefined, { weekday: "short" })
    const weekdays = [] as string[]
    const date = new Date("2019-01-28")

    for (let i = 0; i < 7; i++) {
      weekdays.push(formatter.format(date))
      date.setDate(date.getDate() + 1)
    }

    return weekdays
  }

  get valueAsDate() {
    return this.props.valueAsDate || (this.props.value ? new Date(this.props.value) : undefined)
  }
}
