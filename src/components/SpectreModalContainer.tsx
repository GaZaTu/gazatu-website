import * as React from "react";
import { hot } from "react-hot-loader";

export interface Modal {
  size?: "sm" | "lg"
  hideCloseButton?: boolean
  title?: React.ReactNode
  body?: React.ReactNode
  footer?: React.ReactNode
}

interface Props { }

interface State {
  modal: Modal | null
  resolve: () => any
}

class SpectreModalContainer extends React.PureComponent<Props, State> {
  static instance?: SpectreModalContainer

  constructor(props: any) {
    super(props)

    this.state = {
      modal: null,
      resolve: () => null,
    }

    SpectreModalContainer.instance = this
  }

  show(modal: Modal) {
    return {
      hide: () => this.hide(),
      done: new Promise<void>(resolve => {
        this.setState({ modal, resolve })
      }),
    }
  }

  hide() {
    this.state.resolve()

    this.setState({ modal: null, resolve: () => null })
  }

  handleHide = () => {
    this.hide()
  }

  render() {
    return (
      <div>
        {this.state.modal && (
          <div className={`modal ${this.state.modal.size ? `modal-${this.state.modal.size}` : ""} active`}>
            <a className="modal-overlay" onClick={this.handleHide} />
            <div className="modal-container">
              <div className="modal-header">
                {!this.state.modal.hideCloseButton && (
                  <button className="btn btn-clear float-right" onClick={this.handleHide} />
                )}
                <div className="modal-title h5">{this.state.modal.title}</div>
              </div>
              
              <div className="modal-body">
                <div className="content">
                  {this.state.modal.body}
                </div>
              </div>

              <div className="modal-footer">
                {this.state.modal.footer}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default hot(module)(SpectreModalContainer)

export function showModal(options: Modal) {
  if (!SpectreModalContainer.instance) {
    throw "modal instance undefined"
  }

  return SpectreModalContainer.instance.show(options)
}

export async function showConfirmation(what: React.ReactNode) {
  let ok = false
  
  const handleOk = () => {
    ok = true
    modal.hide()
  }

  const handleCancel = () => modal.hide()

  const modal = showModal({
    size: "sm",
    hideCloseButton: true,
    body: what,
    footer: (() => (
      <div className="btn-group btn-group-block col-5 col-sm-12 col-ml-auto">
        <button className="btn btn-success" onClick={handleOk}>
          <i className="icon icon-check" />
        </button>
      
        <button className="btn btn-error" onClick={handleCancel}>
          <i className="icon icon-cross" />
        </button>
      </div>
    ))(),
  })
  
  await modal.done

  return ok
}
