import * as React from "react";
import * as classNames from "classnames";

interface SpectreTabProps {
  name: string
  canClose?: boolean
  badge?: string
}

export class SpectreTab extends React.PureComponent<SpectreTabProps> { }

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode
  canCloseTabs?: boolean
  onCloseTab?: (tab: string) => any
  defaultTab?: string
  renderHiddenTabs?: boolean
  tabAction?: React.ReactNode
  stretchTabs?: boolean
}

interface State {
  activeTab: string
}

export default class SpectreTabs extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      activeTab: props.defaultTab || "",
    }
  }

  closeTab(tab: string) {
    if (this.props.onCloseTab) {
      this.props.onCloseTab(tab)
    }
  }

  changeActiveTab(tab: string) {
    this.setState({
      activeTab: tab,
    })
  }

  getTabs() {
    const tabs = [] as SpectreTab["props"][]

    React.Children.forEach(this.props.children, child => {
      if (typeof child === "object") {
        const childAsElem = child as React.ReactElement<any>

        if (typeof childAsElem.type === "function") {
          tabs.push(childAsElem.props)
        }
      }
    })

    return tabs
  }

  render() {
    const { children, canCloseTabs, onCloseTab, defaultTab, renderHiddenTabs, tabAction, stretchTabs, ...nativeProps } = this.props
    const className = classNames("spectre-tabs", nativeProps.className)
    const tabs = this.getTabs()

    return (
      <div {...nativeProps} className={className}>
        <ul className={`tab ${this.props.stretchTabs ? "tab-block" : ""}`}>
          {tabs.map(tab => (
            <li key={tab.name} className={`tab-item ${tab.name === this.state.activeTab ? "active" : ""}`}>
              <a className={`c-hand ${tab.badge !== undefined ? "badge" : ""}`} style={{ whiteSpace: "nowrap" }} data-badge={tab.badge} onClick={() => this.changeActiveTab(tab.name)}>
                {tab.name}
                {this.props.canCloseTabs && (tab.canClose !== false) && (
                  <span className="btn btn-clear" onClick={() => this.closeTab(tab.name)}></span>
                )}
              </a>
            </li>
          ))}

          {tabAction && (
            <li className="tab-item tab-action">{tabAction}</li>
          )}
        </ul>

        <div className="tab-pages">
          {this.props.renderHiddenTabs ?
            tabs.map(tab => (
              <div key={tab.name} className={`tab-page ${tab.name === this.state.activeTab ? "" : "d-hide"}`}>{tab.children}</div>
            ))
            :
            tabs.filter(tab => tab.name === this.state.activeTab).map(tab => (
              <div key={tab.name} className="tab-page">{tab.children}</div>
            ))
          }
        </div>
      </div>
    )
  }
}
