import * as React from "react";
import { HashRouter } from "react-router-dom";
import { hot } from "react-hot-loader";
import "./App.scss";
import AppNavItemLink from "./components/AppNavItemLink";
import AppNavItemList from "./components/AppNavItemList";
import LazyRoute from "./components/LazyRoute";
import "./register-service-worker";

interface Props { }

interface State {
  sidebarActive: boolean
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      sidebarActive: false,
    }
  }

  toggleSidebar = () => {
    this.setState({
      sidebarActive: !this.state.sidebarActive,
    })
  }
  
  render() {
    return (
      <HashRouter>
        <div className="App off-canvas off-canvas-sidebar-show">
          <div className="app-navbar">
            <a className="off-canvas-toggle btn btn-link btn-action" onClick={this.toggleSidebar}>
              <i className="icon icon-menu" />
            </a>

            <a className="btn btn-primary" href="https://github.com/GaZaTu/gazatu-website" target="_blank" rel="noreferrer">GitHub</a>
          </div>

          <div className={`app-sidebar off-canvas-sidebar ${this.state.sidebarActive ? "active" : ""}`}>
            <div className="app-brand">
              <a href="/">GAZATU.WIN</a>
            </div>
            <div className="app-nav">
              <ul className="nav">
                <AppNavItemLink to="/">Start</AppNavItemLink>
                <AppNavItemList title="Trivia">
                  <AppNavItemLink to="/trivia/questions">Questions</AppNavItemLink>
                </AppNavItemList>
              </ul>
            </div>
          </div>
          <a className="off-canvas-overlay" onClick={this.toggleSidebar} />
          <div className="app-content off-canvas-content">
            <LazyRoute exact path="/trivia/questions" provider={() => import("./views/TriviaQuestionsView")} />
          </div>
        </div>
      </HashRouter>
    )
  }
}

export default hot(module)(App)
