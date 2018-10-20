import { ApiEndpointGroup, api } from "../utils";

export interface PermissionData {
  _id: string
  name: string
}

export interface UserData {
  _id: string
  name: string
  permissions: PermissionData[]
  createdAt: string
  updatedAt: string
  // special
  isMaster?: boolean
}

export interface AuthData {
  username: string
  password: string
  repeatedPassword?: string
}

export interface AuthResult {
  user: UserData
  token: string
}

// const usersApi = new EndpointGroup<UserData>("/users")

export const authApi = {
  // users: usersApi,
  register: (data: AuthData) => api.post("/register", data).then(res => res.data as UserData),
  authenticate: (data: AuthData) => api.post("/authenticate", data).then(res => res.data as AuthResult),
  emptyUser: () => ({
    name: "",
    permissions: [],
  } as Partial<UserData>),
}
