import * as React from "react";
import { hot } from "react-hot-loader";
import "./ToastContainer.scss"

export interface Toast {
  id?: string
  type?: "primary" | "success" | "warning" | "error"
  closeButton?: boolean
  timeout?: number
  children: React.ReactNode
}

interface Props { }

interface State {
  toasts: Toast[]
}

class ToastContainer extends React.PureComponent<Props, State> {
  static instance?: ToastContainer

  constructor(props: any) {
    super(props)

    this.state = {
      toasts: [],
    }

    ToastContainer.instance = this
  }

  addToast(toastToAdd: Toast) {
    toastToAdd.id = Math.random().toString(36).substr(2, 10)

    if (!toastToAdd.closeButton || toastToAdd.timeout) {
      setTimeout(() => this.removeToast(toastToAdd), toastToAdd.timeout || 10000)
    }

    this.setState({
      toasts: [toastToAdd, ...this.state.toasts],
    })
  }

  removeToast(toastToRemove: Toast) {
    this.setState({
      toasts: this.state.toasts.filter(toast => toast.id !== toastToRemove.id),
    })
  }

  render() {
    return (
      <div className="toast-container">
        {this.state.toasts.map((toast, index) => (
          <div key={index} className={`toast ${toast.type ? `toast-${toast.type}` : ""}`} style={{ bottom: `${1 + (index * 3)}rem` }}>
            {toast.closeButton && (<button className="btn btn-clear float-right" onClick={() => this.removeToast(toast)} />)}
            <small>{toast.children}</small>
          </div>
        ))}
      </div>
    )
  }
}

export default hot(module)(ToastContainer)

export function toast(children: React.ReactNode, options = {} as Partial<Toast>) {
  if (ToastContainer.instance) {
    ToastContainer.instance.addToast(Object.assign(options, { children }))
  }
}

function makeToasterFn(type: any) {
  return (children: React.ReactNode, options = {} as Partial<Toast>) => {
    return toast(children, Object.assign(options, { type }))
  }
}

export const toaster = {
  info: makeToasterFn(undefined),
  primary: makeToasterFn("primary"),
  success: makeToasterFn("success"),
  warning: makeToasterFn("warning"),
  error: makeToasterFn("error"),
}
