import Axios from "axios";
import { observable, observe, computed } from "mobx";
import { AuthResult, UserData } from "./api/auth.api";
import * as idbKeyval from "idb-keyval";

class Authorization {
  static idbKeyvalKey = "AuthResult"

  @observable
  token?: string
  @observable
  user?: UserData

  constructor() {
    idbKeyval.get<AuthResult>(Authorization.idbKeyvalKey).then(res => {
      if (res) {
        this.login(res)
      }
    })
  }

  @computed
  get isLoggedIn() {
    return !!this.token
  }

  hasPermission(...needs: string[]) {
    if (!this.user) {
      return false
    }

    const permissions = this.user.permissions.map(perm => perm.name)

    if (!this.user.isMaster) {
      for (const permission of needs) {
        if (!permissions.includes(permission)) {
          return false
        }
      }
    }

    return true
  }

  login(auth: AuthResult) {
    this.token = auth.token
    this.user = auth.user

    idbKeyval.set(Authorization.idbKeyvalKey, auth)
  }

  logout() {
    this.token = undefined
    this.user = undefined

    idbKeyval.del(Authorization.idbKeyvalKey)
  }
}

export const authorization = new Authorization()

export const api = Axios.create({
  baseURL: (process.env.NODE_ENV === "production") ? "https://api.gazatu.xyz" : "http://localhost:8088",
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

type Queryfy<T> = {
  [P in keyof T]?: T[P] | string
}

export class ApiEndpointGroup<TData, TQuery = TData | { [key: string]: any }> {
  path: string
  
  constructor(path: string) {
    this.path = path
  }

  get(query?: Queryfy<TQuery>) {
    return api.get(this.path, { params: query }).then(res => res.data as TData[])
  }

  getById(id: string) {
    return api.get(`${this.path}/${id}`).then(res => res.data as TData)
  }

  post(data: Partial<TData>) {
    return api.post(this.path, data).then(res => res.data as TData)
  }

  put(id: string, data: Partial<TData>) {
    return api.put(`${this.path}/${id}`, data)
  }

  delete(id: string) {
    return api.delete(`${this.path}/${id}`)
  }
}

type ProtoOf<T> = Pick<T, keyof T>

interface LoadingState {
  loading: boolean
}

export const loading = <T extends React.Component<any, LoadingState>, K extends keyof T>
  (proto: ProtoOf<T>, key: K, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => {
  const method = descriptor.value!

  descriptor.value = async function (this: T, ...args: any[]) {
    this.setState({ loading: true })

    const result = await method.apply(this, args)

    this.setState({ loading: false })

    return result
  }
}
