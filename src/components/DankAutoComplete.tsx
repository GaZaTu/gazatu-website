import * as React from "react";
import { hot } from "react-hot-loader";

interface Props {
  options: string[]
  tags: string[]
  readOnly?: boolean
  onChange?: (tags: string[]) => any
}

interface State {

}

class DankAutoComplete extends React.PureComponent<Props, State> {
  add(which: string) {
    if (this.props.onChange) {
      this.props.onChange([...this.props.tags, which])
    }
  }

  remove(which: string) {
    if (this.props.onChange) {
      this.props.onChange(this.props.tags.filter(tag => tag !== which))
    }
  }

  handleNewTagKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === " ") {
      const newTag = event.currentTarget.value.slice(0, -1)

      this.add(newTag)

      event.currentTarget.value = ""
    }
  }

  render() {
    return (
      <div className="form-autocomplete">
        <div className="form-autocomplete-input form-input">
          {this.props.tags.map(tag => (
            <div key={tag} className="chip">
              <span>{tag}</span>
              {!this.props.readOnly && (
                <a className="btn btn-clear" onClick={() => this.remove(tag)} />
              )}
            </div>
          ))}
          {!this.props.readOnly && (
            <input className="form-input" type="text" placeholder="typing here" onKeyUp={this.handleNewTagKeyUp} />
          )}
        </div>

        {!this.props.readOnly && (
          <ul className="menu" style={{ zIndex: "unset" }}>
            {this.props.options.filter(opt => !this.props.tags.includes(opt)).map(opt => (
              <li key={opt} className="menu-item">
                <a className="c-hand" onClick={() => this.add(opt)}>
                  <div className="tile tile-centered">
                    <div className="tile-content">{opt}</div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
}

export default hot(module)(DankAutoComplete)
