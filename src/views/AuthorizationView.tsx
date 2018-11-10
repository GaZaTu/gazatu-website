import * as React from "react";
import { hot } from "react-hot-loader";
import { Formik, FormikActions, Form, Field, FormikErrors } from "formik";
import { AuthData, authApi } from "../api/auth.api";
import { authorization } from "../utils";
import { toaster } from "../components/ToastContainer";
import { RouteComponentProps } from "react-router";

interface RouteParams { }

type Props = RouteComponentProps<RouteParams>

interface State {
  data: AuthData
}

class AuthorizationView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      data: {
        username: "",
        password: "",
        repeatedPassword: "",
      },
    }
  }

  componentDidMount() {
    if (authorization.isLoggedIn) {
      authorization.logout()
      this.props.history.push("/login")
    }
  }
  
  handleAuthenticate = async (data: AuthData, actions: FormikActions<AuthData>) => {
    try {
      const authResult = await authApi.authenticate(data)

      authorization.login(authResult)

      this.props.history.push("/")
    } catch (error) {
      toaster.error(`${error}`)
    } finally {
      actions.setSubmitting(false)
    }
  }

  handleRegister = async (data: AuthData, actions: FormikActions<AuthData>) => {
    try {
      await authApi.register(data)
      await this.handleAuthenticate(data, actions)
    } catch (error) {
      toaster.error(`${error}`)
    } finally {
      actions.setSubmitting(false)
    }
  }

  render() {
    return (
      <div>
        <h2>Authorization</h2>
        <Formik
          enableReinitialize
          initialValues={this.state.data}
          onSubmit={this.handleAuthenticate}
        >
          {form => (
            <Form className="form-horizontal">
              <div className="form-group">
                <div className="col-6 col-sm-12">
                  <label className="form-label">Username*</label>
                  <Field className="form-input" name="username" placeholder="Username" required />
                </div>
              </div>

              <div className="form-group">
                <div className="col-6 col-sm-12">
                  <label className="form-label">Password*</label>
                  <Field className="form-input" type="password" name="password" placeholder="Password" required />
                </div>
              </div>

              <div className="btn-group btn-group-block col-1 col-sm-3">
                <button className={`btn ${form.isSubmitting ? "loading" : ""}`} type="submit">Login</button>
              </div>
            </Form>
          )}
        </Formik>

        <Formik
          enableReinitialize
          initialValues={this.state.data}
          validate={(data: AuthData) => {
            const errors = {} as FormikErrors<AuthData>

            if (data.password !== data.repeatedPassword) {
              errors.repeatedPassword = "Passwords don't match"
            }

            return errors
          }}
          onSubmit={this.handleRegister}
        >
          {form => (
            <Form className="form-horizontal">
              <div className="form-group">
                <div className="col-6 col-sm-12">
                  <label className="form-label">Username*</label>
                  <Field className="form-input" name="username" placeholder="Username" required />
                </div>
              </div>

              <div className="form-group">
                <div className="col-6 col-sm-12">
                  <label className="form-label">Password*</label>
                  <Field className="form-input" type="password" name="password" placeholder="Password" required />
                </div>
              </div>

              <div className="form-group">
                <div className="col-6 col-sm-12">
                  <label className="form-label">Repeat password*</label>
                  <Field className={`form-input ${form.errors.repeatedPassword ? "is-error" : ""}`} type="password" name="repeatedPassword" placeholder="Repeat password" required />
                  {form.errors.repeatedPassword && (<p className="form-input-hint">{form.errors.repeatedPassword}</p>)}
                </div>
              </div>

              <div className="btn-group btn-group-block col-1 col-sm-3">
                <button className={`btn ${form.isSubmitting ? "loading" : ""}`} type="submit">Register</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    )
  }
}

export default hot(module)(AuthorizationView)
