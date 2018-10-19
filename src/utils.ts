import Axios from "axios";
import { observable, observe, computed } from "mobx";

export type IdType = number | "new"

class Authorization {
  @observable
  token = ""

  @computed
  get isLoggedIn() {
    return !!this.token
  }

  login(auth: any) {
    this.token = auth.token
  }

  logout() {
    this.token = ""
  }
}

export const authorization = new Authorization()

export const api = Axios.create({
  baseURL: "api.gazatu.win",
  headers: {
    post: {
      "Content-Type": "application/json",
    },
  },
})

observe(authorization, "token", change => {
  const commonHeaders = api.defaults.headers.common

  if (change.newValue) {
    commonHeaders["Authorization"] = `Bearer ${change.newValue}`
  } else if (commonHeaders["Authorization"]) {
    delete commonHeaders["Authorization"]
  }
})

api.interceptors.response.use(undefined, err => {
  if (authorization.isLoggedIn && err.response && err.response.status === 401) {
    authorization.logout()
  }

  return Promise.reject(err)
})
