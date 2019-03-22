import * as React from "react";
import "./ActivityCalendar.scss";

interface Props {
  months?: number
  breakpoints: { [key: number]: string }
  activities: Date[]
}

interface State { }

export default class AcitivityCalendar extends React.PureComponent<Props, State> {
  render() {
    const months = this.props.months || 6
    const today = new Date()

    return (
      <div className="activity-calendar container">
        <div className="columns">
          {Array.from(Array(months).keys()).reverse()
            .map(i => {
              const date = new Date(today)
              date.setMonth(today.getMonth() - i)
              return date
            })
            .map(date => (
              <AcitivityCalendarMonth key={date.getMonth()} year={date.getFullYear()} month={date.getMonth()} breakpoints={this.props.breakpoints} activities={this.props.activities.filter(a => (a.getFullYear() === date.getFullYear()) && (a.getMonth() === date.getMonth()))} />
            ))}
        </div>
      </div>
    )
  }
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, (month === 11) ? 1 : month + 1, 0).getDate()
}

interface AcitivityCalendarMonthProps {
  year: number
  month: number
  breakpoints: { [key: number]: string }
  activities: Date[]
}

class AcitivityCalendarMonth extends React.PureComponent<AcitivityCalendarMonthProps> {
  static shortMonthFormatter = new Intl.DateTimeFormat(undefined, { year: "2-digit", month: "short" })

  render() {
    const daysInMonth = getDaysInMonth(this.props.year, this.props.month)
    const firstDayInMonth = new Date(this.props.year, this.props.month, 1)

    return (
      <div className="month column col-sm-12 col-md-6 col-3">
        <div className="tooltip" data-tooltip={`${this.props.activities.length} Entries`}>{AcitivityCalendarMonth.shortMonthFormatter.format(firstDayInMonth)}</div>
        {Array.from(Array(firstDayInMonth.getDay() - 1).keys()).map(i => (
          <span key={i} className="day" style={{ backgroundColor: "transparent" }}></span>
        ))}
        {Array.from(Array(daysInMonth).keys()).map(i => (
          <AcitivityCalendarDay key={i} year={this.props.year} month={this.props.month} date={firstDayInMonth.getDate() + i} breakpoints={this.props.breakpoints} activities={this.props.activities.filter(a => a.getDate() === (firstDayInMonth.getDate() + i))} />
        ))}
      </div>
    )
  }
}

interface AcitivityCalendarDayProps {
  year: number
  month: number
  date: number
  breakpoints: { [key: number]: string }
  activities: Date[]
}

class AcitivityCalendarDay extends React.PureComponent<AcitivityCalendarDayProps> {
  static shortDayFormatter = new Intl.DateTimeFormat(undefined, { year: "2-digit", month: "short", day: "2-digit", weekday: "short" })

  render() {
    const day = new Date(this.props.year, this.props.month, this.props.date)
    const breakpointNumbers = Object.keys(this.props.breakpoints).map(k => Number(k)).sort((a, b) => a - b)

    let backgroundColor = ""

    for (const breakpoint of breakpointNumbers) {
      if (this.props.activities.length >= breakpoint) {
        backgroundColor = this.props.breakpoints[breakpoint]
      }
    }

    return (
      <span className="day tooltip" style={{ backgroundColor }} data-tooltip={`${AcitivityCalendarDay.shortDayFormatter.format(day)}\n${this.props.activities.length} Entries`}></span>
    )
  }
}
