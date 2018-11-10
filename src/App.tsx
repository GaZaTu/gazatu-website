import * as React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import { hot } from "react-hot-loader";
import "./App.scss";
import AppNavItemLink from "./components/AppNavItemLink";
import AppNavItemList from "./components/AppNavItemList";
import LazyRoute from "./components/LazyRoute";
import "./register-service-worker";
import { authorization } from "./utils";
import { observer } from "mobx-react";
import ToastContainer from "./components/ToastContainer";
import ModalContainer from "./components/ModalContainer";
import MenuContainer from "./components/MenuContainer";

interface Props { }

interface State {
  sidebarActive: boolean
}

@observer
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
              <a href="/">GAZATU.XYZ</a>
            </div>
            <div className="app-nav">
              <ul className="nav">
                <AppNavItemLink to="/">Start</AppNavItemLink>
                <AppNavItemList title="Trivia" matchStartsWith="/trivia">
                  <AppNavItemLink to="/trivia/questions/new">Submit</AppNavItemLink>
                  <AppNavItemLink to="/trivia/questions">Questions</AppNavItemLink>
                  {authorization.hasPermission("trivia") && [
                    (<AppNavItemLink key={1} to="/trivia/reports">Reports</AppNavItemLink>),
                    (<AppNavItemLink key={2} to="/trivia/reported-questions">Reported Questions</AppNavItemLink>),
                  ]}
                </AppNavItemList>
                {authorization.hasPermission("users") && (
                  <AppNavItemLink to="/users">Users</AppNavItemLink>
                )}
                {authorization.id && (
                  <AppNavItemLink to={`/users/${authorization.id}`}>Profile</AppNavItemLink>
                )}
                <AppNavItemLink to={authorization.isLoggedIn ? "/logout" : "/login"}>{authorization.isLoggedIn ? "Logout" : "Login"}</AppNavItemLink>
              </ul>
            </div>
          </div>
          <a className="off-canvas-overlay" onClick={this.toggleSidebar} />
          <div className="app-content off-canvas-content">
            <Switch>
              <LazyRoute exact path="/" provider={() => import("./views/StartView")} />
              <LazyRoute exact path="/trivia/questions" provider={() => import("./views/TriviaQuestionsView")} />
              <LazyRoute exact path="/trivia/questions/:id" provider={() => import("./views/TriviaQuestionsIdView")} />
              {authorization.hasPermission("trivia") && [
                (<LazyRoute key={1} exact path="/trivia/reports" provider={() => import("./views/TriviaReportsView")} />),
                (<LazyRoute key={2} exact path="/trivia/reported-questions" provider={() => import("./views/TriviaReportedQuestionsView")} />),
              ]}
              {authorization.hasPermission("users") && (
                <LazyRoute exact path="/users" provider={() => import("./views/UsersView")} />
              )}
              <LazyRoute exact path="/users/:id" provider={() => import("./views/UsersIdView")} />
              <LazyRoute exact path={authorization.isLoggedIn ? "/logout" : "/login"} provider={() => import("./views/AuthorizationView")} />
              <Route component={() => (
                <div className="empty" style={{ background: "unset" }}>
                  <p className="empty-title h5">404 - eShrug</p>
                  <p className="empty-subtitle">Page not found</p>
                </div>
              )} />
            </Switch>
            <ModalContainer />
            <ToastContainer />
            <MenuContainer />
            {/* <div style={{ bottom: 0, position: "fixed" }}>
              <p>Test Footer</p>
            </div> */}
          </div>
        </div>
      </HashRouter>
    )
  }
}

export default hot(module)(App)
