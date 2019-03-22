import * as React from "react";
import "./SpectreToastContainer.scss"

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

export default class SpectreToastContainer extends React.PureComponent<Props, State> {
  static instance?: SpectreToastContainer

  constructor(props: any) {
    super(props)

    this.state = {
      toasts: [],
    }

    SpectreToastContainer.instance = this
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
      <div className="spectre-toast-container">
        {this.state.toasts.map((toast, index) => (
          <div key={index} className={`toast ${toast.type ? `toast-${toast.type}` : ""}`} style={{ bottom: `${1 + (index * 3)}rem` }}>
            {toast.closeButton && (
              <button className="btn btn-clear float-right" onClick={() => this.removeToast(toast)} />
            )}
            <small>{toast.children}</small>
          </div>
        ))}
      </div>
    )
  }
}

export function showToast(children: React.ReactNode, options = {} as Partial<Toast>) {
  if (!SpectreToastContainer.instance) {
    throw "toast instance undefined"
  }

  return SpectreToastContainer.instance.addToast(Object.assign(options, { children }))
}

function makeToasterFn(type: Toast["type"]) {
  return (children: React.ReactNode, options = {} as Partial<Toast>) => {
    return showToast(children, Object.assign(options, { type }))
  }
}

export const toaster = {
  info: makeToasterFn(undefined),
  primary: makeToasterFn("primary"),
  success: makeToasterFn("success"),
  warning: makeToasterFn("warning"),
  error: makeToasterFn("error"),
}
