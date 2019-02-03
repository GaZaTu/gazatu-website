import * as React from "react";
import { hot } from "react-hot-loader";
import { RouteComponentProps } from "react-router";
import { Formik, Form, Field, FormikActions } from "formik";
import { loading, authorization } from "../utils";
import { toaster } from "../components/spectre/SpectreToastContainer";
import { showConfirmation } from "../components/spectre/SpectreModalContainer";
import { UserData, authApi } from "../api/auth.api";
import SpectreAutoComplete from "../components/spectre/SpectreAutoComplete";
import SpectreButton from "../components/spectre/SpectreButton";
import SpectreFormGroup from "../components/spectre/SpectreFormGroup";
import SpectreFormikInput from "../components/spectre-formik/SpectreFormikInput";

interface RouteParams {
  id: string
}

interface Props extends RouteComponentProps<RouteParams> { }

interface State {
  loading: boolean
  data: Partial<UserData>
  hasUsersPermission: boolean
  permissions: string[]
  userPermissions: string[]
  isProfile: boolean
  userGrantedNotificationPermission: boolean
}

class UsersIdView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      loading: false,
      data: authApi.emptyUser(),
      hasUsersPermission: false,
      permissions: [],
      userPermissions: [],
      isProfile: false,
      userGrantedNotificationPermission: false,
    }
  }

  get id() {
    return this.props.match.params.id
  }

  set id(id: string) {
    this.props.history.push(`/users/${id}`)
  }

  @loading
  async load() {
    try {
      await this.loadData()
      await Promise.all([
        this.loadPermissions(),
        this.loadUserPermissions(),
      ])
    } catch (error) {
      toaster.error(`${error}`)
      throw error
    }
  }

  async loadData() {
    this.setState({
      data: await authApi.users.id(this.id).get(),
    })
  }

  async loadPermissions() {
    this.setState({
      permissions: await authApi.permissions(),
    })
  }

  async loadUserPermissions() {
    if (this.state.hasUsersPermission) {
      this.setState({
        userPermissions: await authApi.getUserPermissions(this.id),
      })
    } else {
      this.setState({
        userPermissions: authorization.permissions,
      })
    }
  }

  componentDidMount() {
    this.setState({
      hasUsersPermission: authorization.hasPermission("users"),
      userGrantedNotificationPermission: Notification.permission === "granted",
    })

    this.load()
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.match.params.id === authorization.id) {
      this.setState({
        isProfile: true,
      })
    }
  }

  isLoading(form?: { isSubmitting: boolean }) {
    return (this.state.loading || (form && form.isSubmitting))
  }

  handleSubmit = async (data: Partial<UserData>, actions: FormikActions<Partial<UserData>>) => { }

  handleDelete = async () => {
    const accepted = await showConfirmation("Delete?")

    if (accepted) {
      await authApi.users.id(this.id).delete()

      if (authorization.id === this.id) {
        this.props.history.push("/logout")
      } else {
        this.props.history.push("/users")
      }
    }
  }

  handlePermissionsChange = async (permissions: string[]) => {
    await authApi.setUserPermissions(this.id, permissions)
    await this.load()
  }

  handleSetupPushNotifications = async () => {
    const permission = await Notification.requestPermission()

    if (permission === "granted") {
      navigator.serviceWorker.getRegistration().then(serviceWorker => {
        if (serviceWorker) {
          serviceWorker.showNotification("Test")
        }
      })

      this.setState({
        userGrantedNotificationPermission: true,
      })
    }
  }

  render() {
    return (
      <div>
        <h2>User</h2>
        <Formik
          enableReinitialize
          initialValues={this.state.data}
          onSubmit={this.handleSubmit}
        >
          {form => (
            <Form className="form-horizontal">
              <div className="btn-group btn-group-block col-2 col-sm-4 col-ml-auto">
                {/* {this.state.isProfile && (
                  <SpectreButton type="button" color="error" loading={this.isLoading(form)} disabled={this.state.userGrantedNotificationPermission} onClick={this.handleSetupPushNotifications}>
                    <i className="icon icon-message" />
                  </SpectreButton>
                )} */}

                <SpectreButton type="button" color="error" loading={this.isLoading(form)} disabled={this.isLoading(form)} onClick={this.handleDelete}>
                  <i className="icon icon-delete" />
                </SpectreButton>
              </div>

              <SpectreFormGroup label="Username">
                <SpectreFormikInput formik={form} name="username" placeholder="Username" readOnly />
              </SpectreFormGroup>
            </Form>
          )}
        </Formik>

        <label className="form-label">Permissions</label>
        <SpectreAutoComplete options={this.state.permissions} tags={this.state.userPermissions} onChange={this.handlePermissionsChange} readOnly={!this.state.hasUsersPermission} />
      </div>
    )
  }
}

export default hot(module)(UsersIdView)
