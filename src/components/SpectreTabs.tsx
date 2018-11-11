import * as React from "react";
import { hot } from "react-hot-loader";

interface DankTabProps {
  name: string
  canClose?: boolean
  badge?: string
}

export class SpectreTab extends React.PureComponent<DankTabProps> { }

interface Props {
  canCloseTabs?: boolean
  onCloseTab?: (tab: string) => any
  defaultTab?: string
  renderHiddenTabs?: boolean
  renderTabAction?: () => React.ReactNode
  stretchTabs?: boolean
}

interface State {
  activeTab: string
}

class SpectreTabs extends React.PureComponent<Props, State> {
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
    const tabs = this.getTabs()

    return (
      <div className="dank-tabs">
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

          {this.props.renderTabAction && this.props.renderTabAction()}
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

export default hot(module)(SpectreTabs)
