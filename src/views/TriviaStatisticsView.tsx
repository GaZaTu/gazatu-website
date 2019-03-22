import * as React from "react";
import { RouteComponentProps } from "react-router";
import ActivityCalendar from "../components/ActivityCalendar";
import { Statistics, triviaApi } from "../api/trivia.api";
import { toaster } from "../components/spectre/SpectreToastContainer";

interface RouteParams { }

interface Props extends RouteComponentProps<RouteParams> { }

interface State {
  statistics: Partial<Statistics>
}

export default class TriviaStatisticsView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      statistics: {},
    }
  }

  componentDidMount() {
    this.load()
  }

  async load() {
    try {
      this.setState({
        statistics: await triviaApi.statistics(),
      })
    } catch (error) {
      toaster.error(`${error}`)
    }
  }

  render() {
    return (
      <div>
        <h3 className="s-title">Trivia Statistics</h3>
        <p>Questions: {this.state.statistics.questionCount || 0}</p>
        <p>Verified questions: {this.state.statistics.verifiedQuestionCount || 0}</p>
        <p>Categories: {this.state.statistics.categoryCount || 0}</p>
        <ActivityCalendar breakpoints={this.breakpoints} activities={this.activities} />
        <div className="columns">
          <div className="column col-sm-12">
            <p>Top Submitters</p>
            {(this.state.statistics.topSubmitters || []).map(s => (
              <div key={s.submitter} className="columns">
                <div className="column">{s.submitter}</div>
                <div className="column">{s.submissions}</div>
              </div>
            ))}
          </div>

          <div className="column col-sm-12">
            <p>Top Categories</p>
            {(this.state.statistics.topCategories || []).map(c => (
              <div key={c.category} className="columns">
                <div className="column">{c.category}</div>
                <div className="column">{c.submissions}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  get breakpoints() {
    return {
      0: "lightgray",
      1: "rgb(198, 228, 139",
      5: "rgb(123, 201, 111)",
      10: "rgb(35, 154, 59)",
      15: "rgb(25, 97, 39)",
    }
  }

  get activities() {
    const dates = this.state.statistics.submissionDates || []

    return dates.map(d => new Date(d.createdAt))
  }
}
