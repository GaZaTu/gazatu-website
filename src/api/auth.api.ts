import { ApiEndpointGroup, api } from "../utils";

export interface UserData {
  _id: string
  username: string
  permissions: string[]
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

const usersApi = new ApiEndpointGroup<UserData>("/users")

export const authApi = {
  users: usersApi,
  register: (data: AuthData) => api.post("/register", data).then(res => res.data as UserData),
  authenticate: (data: AuthData) => api.post("/authenticate", data).then(res => res.data as AuthResult),
  permissions: () => api.get("/permissions").then(res => res.data as string[]),
  getUserPermissions: (id: string) => api.get(`/users/${id}/permissions`).then(res => res.data as string[]),
  setUserPermissions: (id: string, permissions: string[]) => api.put(`/users/${id}/permissions`, permissions),
  emptyUser: () => ({
    username: "",
    permissions: [],
  } as Partial<UserData>),
}
