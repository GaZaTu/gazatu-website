import * as React from "react";
import { hot } from "react-hot-loader";
import Pagination from "./Pagination";

export interface DankColumnProps {
  name: string
  title?: string
  flex?: string
  filter?: "input" | "select"
  render?: (cell: any, row: any) => React.ReactNode

  filterOptions?: string[]
  filterStr?: string
  sortDir?: 1 | -1
}

export class DankColumn extends React.PureComponent<DankColumnProps> { }

interface Props {
  data: any[]
  style?: React.CSSProperties
  caption?: string
  keepHeadOnMobile?: boolean
}

interface State {
  page: number
}

class DankTable extends React.PureComponent<Props, State> {
  columns = [] as DankColumnProps[]
  pageSize = 25
  pageCount = 0
  
  constructor(props: Props) {
    super(props)

    this.state = {
      page: 0,
    }
  }

  componentDidMount() {
    this.updateColumns()
  }

  onColTitleClick = (col: DankColumnProps) => {
    const sortDir = col.sortDir

    for (const col of this.columns) {
      col.sortDir = undefined
    }

    if (sortDir === 1) {
      col.sortDir = -1
    } else if (sortDir === -1) {
      col.sortDir = undefined
    } else {
      col.sortDir = 1
    }

    this.forceUpdate()
  }

  onColFilterChange = (col: DankColumnProps, target: EventTarget) => {
    col.filterStr = (target as HTMLInputElement | HTMLSelectElement).value

    this.forceUpdate()
  }

  updateColumns() {
    const columns = [] as DankColumnProps[]
    const children = Array.isArray(this.props.children) ? this.props.children : [this.props.children]

    for (const child of children) {
      if (typeof child === "object") {
        const childAsElem = child as React.ReactElement<any>

        if (typeof childAsElem.type === "function") {
          if (childAsElem.type.prototype instanceof DankColumn) {
            columns.push(Object.assign({}, childAsElem.props))
          }
        }
      }
    }

    this.columns = columns

    return columns
  }

  render() {
    const { style, caption } = this.props
    const data = this.getVisibleData()

    return (
      <div>
        <table className="responsive-table striped" style={style}>
          {caption && <caption>{caption}</caption>}
          <thead className={`${this.props.keepHeadOnMobile ? "keep-on-mobile" : ""}`}>
            <tr>
              {this.columns.map(col => (
                <th key={col.name} style={{ flex: col.flex, cursor: "pointer" }} onClick={() => this.onColTitleClick(col)}>
                  <span>{col.title || col.name}</span>
                  {col.sortDir === 1 && (<i className="icon icon-arrow-up" style={{ marginLeft: 5 }} />)}
                  {col.sortDir === -1 && (<i className="icon icon-arrow-down" style={{ marginLeft: 5 }} />)}
                </th>
              ))}
            </tr>
            <tr>
              {this.getFilterRowVisibility() && this.columns.map(col =>
                <th key={col.name} style={{ flex: col.flex }}>
                  {this.getRenderedColFilter(col)}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {this.columns.map(col => (
                  <td key={col.name} style={{ flex: col.flex }} data-label={col.name}>{this.getRenderedCell(row, col)}</td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td>
                  <div className="empty">
                    <p className="empty-title h5">No Data</p>
                    <p className="empty-subtitle">Filters don't apply or it's actually empty</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {this.props.data.length >= this.pageSize && (
          <Pagination pageCount={this.pageCount} page={this.state.page} onChange={page => this.setState({ page })} />
        )}
      </div>
    )
  }

  getVisibleData() {
    const data = this.getSortedData()
    const index = this.pageSize * this.state.page

    this.updatePageCount(data)
    
    return data.slice(index, index + this.pageSize)
  }

  getSortedData() {
    const data = this.getFilteredData()

    for (const col of this.columns) {
      if (col.sortDir) {
        return data.sort((a, b) => {
          if (a[col.name] === b[col.name]) return 0
          if (a[col.name] < b[col.name]) return -col.sortDir!

          return col.sortDir!
        })
      }
    }

    return data
  }

  getFilteredData() {
    return this.getData().filter(row => {
      for (const col of this.columns) {
        if (col.filterStr) {
          const cell = this.getStringifiedCell(row, col).toLowerCase()
          const filter = col.filterStr.toLowerCase()

          if (!cell.includes(filter)) {
            return false
          }
        }
      }

      return true
    })
  }

  getData() {
    for (const col of this.columns) {
      if (col.filter === "select") {
        col.filterOptions = [""]

        for (const row of this.props.data) {
          const cell = this.getStringifiedCell(row, col)

          if (!col.filterOptions.includes(cell)) {
            col.filterOptions.push(cell)
          }
        }
      }
    }

    return this.props.data
  }

  updatePageCount(data: any[]) {
    this.pageCount = Math.ceil(data.length / this.pageSize)
  }

  getStringifiedCell(row: any, col: DankColumnProps) {
    const cell = row[col.name]

    if (cell === null || cell === undefined) {
      return ""
    } else {
      return String(cell)
    }
  }

  getRenderedCell(row: any, col: DankColumnProps) {
    if (col.render) {
      return col.render(row[col.name], row)
    } else {
      return row[col.name]
    }
  }

  getFilterRowVisibility() {
    for (const col of this.columns) {
      if (col.filter) {
        return true
      }
    }

    return false
  }

  getRenderedColFilter(col: DankColumnProps) {
    if (col.filter === "input") {
      return (
        <input className="form-input input-sm" onKeyUp={ev => this.onColFilterChange(col, ev.target)} />
      )
    } else if (col.filter === "select") {
      return (
        <select className="form-select select-sm" onChange={ev => this.onColFilterChange(col, ev.target)}>
          {col.filterOptions && (
            col.filterOptions.map(opt => (
              <option key={opt}>{opt}</option>
            ))
          )}
        </select>
      )
    } else {
      return null
    }
  }
}

export default hot(module)(DankTable)
