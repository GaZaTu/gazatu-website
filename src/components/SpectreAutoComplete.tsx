import * as React from "react";
import { hot } from "react-hot-loader";

interface Props {
  options: string[]
  tags: string[]
  readOnly?: boolean
  onChange?: (tags: string[]) => any
}

interface State {
  newTag: string
}

class SpectreAutoComplete extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      newTag: "",
    }
  }

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

  getFilteredOptions() {
    return this.props.options.filter(opt => {
      if (this.props.tags.includes(opt)) {
        return false
      }

      if (this.state.newTag && !opt.includes(this.state.newTag)) {
        return false
      }

      return true
    })
  }

  handleNewTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newTag: event.currentTarget.value,
    })
  }

  handleNewTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === " ") {
      event.preventDefault()
      
      this.add(this.state.newTag)
      this.setState({
        newTag: "",
      })
    } else if (event.key === "Tab") {
      event.preventDefault()

      const first = this.getFilteredOptions()[0]

      if (first) {
        this.add(first)
        this.setState({
          newTag: "",
        })
      }
    }
  }

  render() {
    return (
      <div className="form-autocomplete">
        <div className="form-autocomplete-input form-input">
          {this.props.tags.map(tag => (
            <div key={tag} className="chip">
              {tag}
              {!this.props.readOnly && (
                <a className="btn btn-clear" onClick={() => this.remove(tag)} />
              )}
            </div>
          ))}
          {!this.props.readOnly && (
            <input className="form-input" type="text" placeholder="typing here" value={this.state.newTag} onChange={this.handleNewTagChange} onKeyDown={this.handleNewTagKeyDown} />
          )}
        </div>

        {!this.props.readOnly && (
          <ul className="menu" style={{ zIndex: "unset" }}>
            {this.getFilteredOptions().map(opt => (
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

export default hot(module)(SpectreAutoComplete)
