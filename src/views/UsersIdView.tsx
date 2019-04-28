import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Formik, FormikActions } from "formik";
import { loading, authorization } from "../utils";
import { toaster } from "../components/spectre/SpectreToastContainer";
import { showConfirmation } from "../components/spectre/SpectreModalContainer";
import { UserData, authApi } from "../api/auth.api";
import SpectreAutoComplete from "../components/spectre/SpectreAutoComplete";
import SpectreButton from "../components/spectre/SpectreButton";
import SpectreFormikInput from "../components/spectre-formik/SpectreFormikInput";
import SpectreIcon from "../components/spectre/SpectreIcon";
import SpectreFormikForm from "../components/spectre-formik/SpectreFormikForm";
import SpectreFormikFormGroup from "../components/spectre-formik/SpectreFormikFormGroup";
import SpectreButtonGroup from "../components/spectre/SpectreButtonGroup";

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

export default class UsersIdView extends React.PureComponent<Props, State> {
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
        <h3 className="s-title">User</h3>
        <Formik
          enableReinitialize
          initialValues={this.state.data}
          onSubmit={this.handleSubmit}
        >
          {form => (
            <SpectreFormikForm formik={form} horizontal>
              <SpectreButtonGroup className="col-2 col-sm-4 col-ml-auto" block>
                {/* {this.state.isProfile && (
                  <SpectreButton type="button" color="error" loading={this.state.loading} disabled={this.state.userGrantedNotificationPermission} onClick={this.handleSetupPushNotifications}>
                    <SpectreIcon icon="message" />
                  </SpectreButton>
                )} */}

                <SpectreButton type="button" kind="error" loading={this.state.loading} onClick={this.handleDelete}>
                  <SpectreIcon icon="delete" />
                </SpectreButton>
              </SpectreButtonGroup>

              <SpectreFormikFormGroup name="username" label="Username">
                <SpectreFormikInput placeholder="Username" readOnly />
              </SpectreFormikFormGroup>
            </SpectreFormikForm>
          )}
        </Formik>

        <label className="form-label">Permissions</label>
        <SpectreAutoComplete options={this.state.permissions} tags={this.state.userPermissions} onTagsChange={this.handlePermissionsChange} readOnly={!this.state.hasUsersPermission} canAddNewTags />
      </div>
    )
  }
}
