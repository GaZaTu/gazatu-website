import Axios from "axios";
import { observable, computed } from "mobx";
import { AuthResult, UserData } from "./api/auth.api";

export const api = Axios.create({
  baseURL: (process.env.NODE_ENV === "production") ? "https://api.gazatu.xyz" : "http://localhost:8088",
  headers: {
    post: {
      "Content-Type": "application/json",
    },
  },
})

class Authorization {
  static storageKey = "AuthResult"

  @observable
  token?: string
  @observable
  user?: UserData

  constructor() {
    const auth = localStorage.getItem(Authorization.storageKey)

    if (auth) {
      this.login(JSON.parse(auth))
    }
  }

  @computed
  get isLoggedIn() {
    return !!this.token
  }

  @computed
  get id() {
    return this.user ? this.user._id : null
  }

  @computed
  get permissions() {
    return this.user ? this.user.permissions : []
  }

  hasPermission(...needs: string[]) {
    if (!this.user) {
      return false
    }

    if (!this.user.isMaster) {
      for (const permission of needs) {
        if (!this.user.permissions.includes(permission)) {
          return false
        }
      }
    }

    return true
  }

  login(auth: AuthResult) {
    this.token = auth.token
    this.user = auth.user

    this.updateApiToken(this.token)

    localStorage.setItem(Authorization.storageKey, JSON.stringify(auth))
  }

  logout() {
    this.token = undefined
    this.user = undefined

    this.updateApiToken(this.token)

    localStorage.removeItem(Authorization.storageKey)
  }

  private updateApiToken(token: string | undefined) {
    const commonHeaders = api.defaults.headers.common

    if (token) {
      commonHeaders["Authorization"] = `Bearer ${token}`
    } else if (commonHeaders["Authorization"]) {
      delete commonHeaders["Authorization"]
    }
  }
}

export const authorization = new Authorization()

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

export interface Subscription {
  unsubscribe(): void
}

export function hotkey(def: string, listener: (ev: KeyboardEvent) => any) {
  const defs = def.split("+")
  const keys = defs.filter(key => (key !== "shift") && (key !== "ctrl") && (key !== "alt"))
  const shift = defs.includes("shift")
  const ctrl = defs.includes("ctrl")
  const alt = defs.includes("alt")

  const realListener = (ev: KeyboardEvent) => {
    if (ev.shiftKey === shift && ev.ctrlKey === ctrl && ev.altKey === alt && keys.includes(ev.key)) {
      listener(ev)
    }
  }

  window.addEventListener("keydown", realListener)

  return {
    unsubscribe: () => window.removeEventListener("keydown", realListener)
  } as Subscription
}
