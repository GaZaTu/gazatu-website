import * as React from "react";
import { hot } from "react-hot-loader";
import Pagination from "./Pagination";

export interface DankColumnDefinition {
  key: string
  flex?: string
}

interface Props {
  style?: React.CSSProperties
  caption?: string
  cols: DankColumnDefinition[]
  data: any[]
}

interface State {
  page: number
}

class DankTable extends React.PureComponent<Props, State> {
  pageSize = 25
  pageCount = 0
  
  constructor(props: Props) {
    super(props)

    this.state = {
      page: 0,
    }
  }

  render() {
    const { style, caption, cols } = this.props
    const data = this.getVisibleData()

    return (
      <div>
        <table className="responsive-table striped" style={style}>
          {caption && <caption>{caption}</caption>}
          <thead>
            <tr>
              {cols.map(col => (
                <th key={col.key} style={{ flex: col.flex }}>{col.key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {cols.map(col => (
                  <td key={col.key} style={{ flex: col.flex }} data-label={col.key}>{row[col.key]}</td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td>
                  <div className="empty">
                    <p className="empty-title h5">No Data</p>
                    <p className="empty-subtitle">Either an error happened or it's actually empty</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination pageCount={this.pageCount} page={this.state.page} onChange={page => this.setState({ page })} />
      </div>
    )
  }

  getVisibleData() {
    this.pageCount = Math.ceil(this.props.data.length / this.pageSize)
    
    return this.props.data.slice(this.pageSize * this.state.page, this.pageSize * (this.state.page + 1))
  }
}

export default hot(module)(DankTable)
