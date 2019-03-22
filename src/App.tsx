import * as React from "react";
import { HashRouter, Switch, Route, Redirect, RouteProps } from "react-router-dom";
import SpectreSuspense from "./components/spectre/SpectreSuspense";
import AppNavItemLink from "./components/AppNavItemLink";
import AppNavItemList from "./components/AppNavItemList";
import SpectreToastContainer from "./components/spectre/SpectreToastContainer";
import SpectreModalContainer from "./components/spectre/SpectreModalContainer";
import SpectreMenuContainer from "./components/spectre/SpectreMenuContainer";
import { authorization, production, fontendDomain } from "./utils";
import { observer } from "mobx-react";
import "./register-service-worker";
import "./App.scss";

const StartView = React.lazy(() => import("./views/StartView"))
const TriviaQuestionsView = React.lazy(() => import("./views/TriviaQuestionsView"))
const TriviaQuestionsIdView = React.lazy(() => import("./views/TriviaQuestionsIdView"))
const TriviaReportsView = React.lazy(() => import("./views/TriviaReportsView"))
const TriviaReportedQuestionsView = React.lazy(() => import("./views/TriviaReportedQuestionsView"))
const TriviaStatisticsView = React.lazy(() => import("./views/TriviaStatisticsView"))
const UsersView = React.lazy(() => import("./views/UsersView"))
const UsersIdView = React.lazy(() => import("./views/UsersIdView"))
const ApiRefView = React.lazy(() => import("./views/ApiRefView"))
const AuthorizationView = React.lazy(() => import("./views/AuthorizationView"))

// function routeOrRedirect(condition: boolean, node: React.ReactNode) {
//   if (condition) {
//     return node
//   } else {
//     return <Redirect to="/" />
//   }
// }

// class ProtectedRoute extends React.Component<{ component: any, perms: string[] } & RouteProps> {
//   render() {
//     const { component, perms, ...props } = this.props

//     console.log(perms, authorization.hasPermission(...perms))

//     return (
//       <Route {...props} component={authorization.hasPermission(...perms) ? component : () => (<Redirect to="/" />)} />
//     )
//   }
// }

interface Props { }

interface State {
  sidebarActive: boolean
}

@observer
export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      sidebarActive: false,
    }

    if (production && location.hostname !== fontendDomain) {
      location.hostname = fontendDomain
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
          <header className="navbar app-navbar">
            <section className="navbar-section">
              <a className="off-canvas-toggle btn btn-link btn-action" onClick={this.toggleSidebar}>
                <i className="icon icon-menu" />
              </a>

              <a href="/" className="navbar-brand mr-2 show-lg app-brand">
                <img className="img-responsive" src="/img/gazatu-xyz.svg" />
              </a>
            </section>

            <section className="navbar-section">
              <a className="btn btn-primary" href="https://github.com/GaZaTu/gazatu-website" target="_blank" rel="noreferrer">GitHub</a>
            </section>
          </header>

          <div className={`app-sidebar off-canvas-sidebar ${this.state.sidebarActive ? "active" : ""}`}>
            <div className="app-brand">
              <a href="/">
                <img className="img-responsive" src="/img/gazatu-xyz.svg" />
              </a>
            </div>

            <div className="app-nav">
              <ul className="nav">
                <AppNavItemLink to="/">Start</AppNavItemLink>
                <AppNavItemList title="Trivia" matchStartsWith="/trivia">
                  <AppNavItemLink to="/trivia/statistics">Statistics</AppNavItemLink>
                  <AppNavItemLink to="/trivia/questions/new">Submit</AppNavItemLink>
                  <AppNavItemLink to="/trivia/questions">Questions</AppNavItemLink>
                  {authorization.hasPermission("trivia") && (
                    <React.Fragment>
                      <AppNavItemLink to="/trivia/reports">Reports</AppNavItemLink>
                      <AppNavItemLink to="/trivia/reported-questions">Reported Questions</AppNavItemLink>
                      <AppNavItemLink to="/trivia/questions?verified=false">Unverified Questions</AppNavItemLink>
                    </React.Fragment>
                  )}
                </AppNavItemList>
                {authorization.hasPermission("users") && (
                  <AppNavItemLink to="/users">Users</AppNavItemLink>
                )}
                {authorization.id && (
                  <AppNavItemLink to={`/users/${authorization.id}`}>Profile</AppNavItemLink>
                )}
                <AppNavItemLink to="/api-ref">Api-Ref</AppNavItemLink>
                {authorization.isLoggedIn ?
                  (<AppNavItemLink to="/logout">Logout</AppNavItemLink>) :
                  (<AppNavItemLink to="/login">Login</AppNavItemLink>)
                }
              </ul>
            </div>
          </div>
          <a className="off-canvas-overlay" onClick={this.toggleSidebar} />
          <div className="app-content off-canvas-content">
            <div style={{ paddingBottom: "2rem" }}>
              <SpectreSuspense>
                <Switch>
                  <Route exact path="/" component={StartView} />
                  <Route exact path="/trivia/questions" component={TriviaQuestionsView} />
                  <Route exact path="/trivia/questions/:id" component={TriviaQuestionsIdView} />
                  {/* {authorization.hasPermission("trivia") && ( */}
                    {/* <React.Fragment> */}
                      <Route exact path="/trivia/reports" component={TriviaReportsView} />
                      <Route exact path="/trivia/reported-questions" component={TriviaReportedQuestionsView} />
                    {/* </React.Fragment> */}
                  {/* )} */}
                  <Route exact path="/trivia/statistics" component={TriviaStatisticsView} />
                  {/* {authorization.hasPermission("users") && ( */}
                    <Route exact path="/users" component={UsersView} />
                  {/* )} */}
                  <Route exact path="/users/:id" component={UsersIdView} />
                  <Route exact path="/api-ref" component={ApiRefView} />
                  <Route exact path={authorization.isLoggedIn ? "/logout" : "/login"} component={AuthorizationView} />
                  <Route component={() => (
                    <div className="empty" style={{ background: "unset" }}>
                      <p className="empty-title h5">404 - eShrug</p>
                      <p className="empty-subtitle">Page not found</p>
                    </div>
                  )} />
                </Switch>
              </SpectreSuspense>
            </div>
            {/* <footer style={{ position: "absolute", bottom: "1rem" }}>
              Test Footer
            </footer> */}
            <SpectreModalContainer />
            <SpectreToastContainer />
            <SpectreMenuContainer />
          </div>
        </div>
      </HashRouter>
    )
  }
}
