import * as React from "react";
import { Formik, FormikActions, FormikErrors } from "formik";
import { AuthData, authApi } from "../api/auth.api";
import { authorization } from "../utils";
import { toaster } from "../components/spectre/SpectreToastContainer";
import { RouteComponentProps } from "react-router";
import SpectreFormikFormGroup from "../components/spectre-formik/SpectreFormikFormGroup";
import SpectreFormikInput from "../components/spectre-formik/SpectreFormikInput";
import SpectreButtonGroup from "../components/spectre/SpectreButtonGroup";
import SpectreFormikForm from "../components/spectre-formik/SpectreFormikForm";
import SpectreDivider from "../components/spectre/SpectreDivider";
import SpectreFormikButton from "../components/spectre-formik/SpectreFormikButton";

interface RouteParams { }

interface Props extends RouteComponentProps<RouteParams> { }

interface State { }

export default class AuthorizationView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = { }
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

  get initialValues() {
    return {
      username: "",
      password: "",
      repeatedPassword: "",
    }
  }

  render() {
    return (
      <div>
        <h3 className="s-title">Authorization</h3>
        <div className="columns">
          <Formik<AuthData>
            enableReinitialize
            initialValues={this.initialValues}
            onSubmit={this.handleAuthenticate}
          >
            {form => (
              <SpectreFormikForm formik={form} className="column col-md-12" horizontal>
                <SpectreFormikFormGroup name="username" label="Username*">
                  <SpectreFormikInput type="text" placeholder="Username" required />
                </SpectreFormikFormGroup>

                <SpectreFormikFormGroup name="password" label="Password*">
                  <SpectreFormikInput type="password" placeholder="Password" required />
                </SpectreFormikFormGroup>

                <SpectreButtonGroup className="col-1 col-sm-3" block>
                  <SpectreFormikButton formik={form} type="submit">Login</SpectreFormikButton>
                </SpectreButtonGroup>
              </SpectreFormikForm>
            )}
          </Formik>

          <SpectreDivider className="hide-md" text="OR" vertical />
          <SpectreDivider className="show-md col-md-12" text="OR" textAlign="center" />

          <Formik<AuthData>
            enableReinitialize
            initialValues={this.initialValues}
            validate={data => {
              const errors = {} as FormikErrors<AuthData>

              if (data.password !== data.repeatedPassword) {
                errors.repeatedPassword = "Passwords don't match"
              }

              return errors
            }}
            onSubmit={this.handleRegister}
          >
            {form => (
              <SpectreFormikForm formik={form} className="column col-md-12" horizontal>
                <SpectreFormikFormGroup name="username" label="Username*">
                  <SpectreFormikInput type="text" placeholder="Username" required />
                </SpectreFormikFormGroup>

                <SpectreFormikFormGroup name="password" label="Password*">
                  <SpectreFormikInput type="password" placeholder="Password" required />
                </SpectreFormikFormGroup>

                <SpectreFormikFormGroup name="repeatedPassword" label="Repeat password*">
                  <SpectreFormikInput type="password" placeholder="Repeat password" required />
                </SpectreFormikFormGroup>

                <SpectreButtonGroup className="col-1 col-sm-3" block>
                  <SpectreFormikButton formik={form} type="submit">Register</SpectreFormikButton>
                </SpectreButtonGroup>
              </SpectreFormikForm>
            )}
          </Formik>
        </div>
      </div>
    )
  }
}
