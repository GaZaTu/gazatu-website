import * as React from "react";
import SpectrePagination from "./spectre/SpectrePagination";
import "./DankTable.scss";

export interface DankTableColumnProps {
  name: string
  title?: string
  flex?: string
  filter?: "input" | "select"
  // render?: (cell: any, row: any) => React.ReactNode
  onSort?: (dir: -1 | 1, a: any, b: any) => number

  children?: ((cell: any, row: any) => React.ReactNode) | never[]

  filterOptions?: string[]
  filterStr?: string
  sortDir?: 1 | -1
}

export class DankTableColumn extends React.PureComponent<DankTableColumnProps> { }

interface Props {
  children: React.ReactNode
  data: any[]
  style?: React.CSSProperties
  caption?: string
  keepHeadOnMobile?: boolean
  hotkeys?: boolean
  disableEmptyMsg?: boolean
  onRowContextMenu?: (row: any, event: React.MouseEvent) => any
}

interface State {
  page: number
  columns: DankTableColumnProps[]
}

export default class DankTable extends React.PureComponent<Props, State> {
  pageSize = 25
  pageCount = 0

  constructor(props: Props) {
    super(props)

    this.state = {
      page: 0,
      columns: DankTable.getColumnsFromChildren(props),
    }
  }

  static getColumnsFromChildren(props: Props, prevColumns = [] as DankTableColumnProps[]) {
    const columns = [] as DankTableColumnProps[]

    React.Children.forEach(props.children, child => {
      if (typeof child === "object") {
        const childAsElem = child as React.ReactElement<any>

        if (typeof childAsElem.type === "function") {
          columns.push(Object.assign({}, prevColumns.find(p => p.name === childAsElem.props.name), childAsElem.props))
        }
      }
    })

    return columns
  }

  static getDerivedStateFromProps(props: Props, prevState: State): Partial<State> | null {
    return {
      columns: DankTable.getColumnsFromChildren(props, prevState.columns),
    }
  }

  onColTitleClick = (col: DankTableColumnProps) => {
    const sortDir = col.sortDir

    for (const col of this.state.columns) {
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

  onColFilterChange = (col: DankTableColumnProps, target: EventTarget) => {
    col.filterStr = (target as HTMLInputElement | HTMLSelectElement).value

    this.forceUpdate()
  }

  handleRowContextMenu = (row: any, event: React.MouseEvent) => {
    if (this.props.onRowContextMenu) {
      this.props.onRowContextMenu(row, event)
    }
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
              {this.state.columns.map(col => (
                <th key={col.name} style={{ flex: col.flex, cursor: "pointer", whiteSpace: "nowrap" }} onClick={() => this.onColTitleClick(col)}>
                  <span>{col.title || col.name}</span>
                  {col.sortDir === 1 && (<i className="icon icon-arrow-up" style={{ marginLeft: 5 }} />)}
                  {col.sortDir === -1 && (<i className="icon icon-arrow-down" style={{ marginLeft: 5 }} />)}
                </th>
              ))}
            </tr>
            <tr>
              {this.getFilterRowVisibility() && this.state.columns.map(col =>
                <th key={col.name} style={{ flex: col.flex }}>
                  {this.getRenderedColFilter(col)}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} onContextMenu={ev => this.handleRowContextMenu(row, ev)}>
                {this.state.columns.map(col => (
                  <td key={col.name} style={{ flex: col.flex }} data-label={col.name}>{this.getRenderedCell(row, col)}</td>
                ))}
              </tr>
            ))}
            {(data.length === 0) && !this.props.disableEmptyMsg && (
              <tr style={{ padding: "unset" }}>
                <td style={{ padding: "unset" }}>
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
          <SpectrePagination pageCount={this.pageCount} page={this.state.page} onChange={page => this.setState({ page })} hotkeys={this.props.hotkeys} />
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

    for (const col of this.state.columns) {
      if (col.sortDir) {
        if (col.onSort) {
          return data.sort((a, b) => {
            return col.onSort!(col.sortDir!, a[col.name], b[col.name])
          })
        }

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
      for (const col of this.state.columns) {
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
    for (const col of this.state.columns) {
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

    setTimeout(() => {
      if (this.state.page > this.pageCount) {
        this.setState({
          page: this.pageCount - 1,
        })
      }
    })
  }

  getStringifiedCell(row: any, col: DankTableColumnProps) {
    const cell = row[col.name]

    if (cell === null || cell === undefined) {
      return ""
    } else {
      return String(cell)
    }
  }

  getRenderedCell(row: any, col: DankTableColumnProps) {
    if (typeof col.children === "function") {
      return col.children(row[col.name], row)
    } else {
      return row[col.name]
    }
  }

  getFilterRowVisibility() {
    for (const col of this.state.columns) {
      if (col.filter) {
        return true
      }
    }

    return false
  }

  getRenderedColFilter(col: DankTableColumnProps) {
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

export function tableRenderDate(val: any) {
  return new Date(val).toLocaleDateString()
}

export function tableSortDate(dir: any, a: any, b: any) {
  return ((new Date(a) as any) - (new Date(b) as any)) * dir
}
