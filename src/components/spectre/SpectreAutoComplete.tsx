import * as React from "react";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  options: string[]
  tags: string[]
  readOnly?: boolean
  canAddNewTags?: boolean
  limit?: number
  onTagsChange?: (tags: string[]) => any
}

interface State {
  newTag: string
  focused: boolean
  showInput: boolean
}

export default class SpectreAutoComplete extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      newTag: "",
      focused: false,
      showInput: true,
    }
  }

  static getDerivedStateFromProps(props: Props, prevState: State): Partial<State> | null {
    if (
      (!props.canAddNewTags && props.tags.length === props.options.length) ||
      (props.tags.length === props.limit)
    ) {
      return {
        focused: false,
        showInput: false,
      }
    } else {
      return {
        showInput: true,
      }
    }
  }

  add(which: string) {
    if (this.props.onTagsChange) {
      this.props.onTagsChange([...this.props.tags, which])
    }
  }

  remove(which: string) {
    if (this.props.onTagsChange) {
      this.props.onTagsChange(this.props.tags.filter(tag => tag !== which))
    }
  }

  getFilteredOptions() {
    return this.props.options.filter(opt => {
      if (this.props.tags.includes(opt)) {
        return false
      }

      if (this.state.newTag && !opt.toLowerCase().includes(this.state.newTag.toLowerCase())) {
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

      if (this.props.canAddNewTags && this.state.newTag.length > 0) {
        this.add(this.state.newTag)
        this.setState({
          newTag: "",
        })
      }
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

  handleInputFocus = () => {
    this.setState({
      focused: true,
    })
  }

  handleInputBlur = () => {
    this.setState({
      focused: false,
    })
  }

  render() {
    const { options, tags, readOnly, canAddNewTags, limit, onTagsChange, ...nativeProps } = this.props
    const className = classNames("form-autocomplete", nativeProps.className)

    return (
      <div {...nativeProps} className={className}>
        <div className={`form-autocomplete-input form-input ${this.state.focused && "is-focused"}`} style={{ height: "1.8rem" }}>
          {this.props.tags.map(tag => (
            <div key={tag} className="chip" style={{ marginTop: "0.15rem" }}>
              {tag}
              {!this.props.readOnly && (
                <a className="btn btn-clear" onClick={() => this.remove(tag)} />
              )}
            </div>
          ))}
          {!this.props.readOnly && this.state.showInput && (
            <input className="form-input" type="text" placeholder="..." value={this.state.newTag} onChange={this.handleNewTagChange} onKeyDown={this.handleNewTagKeyDown} onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} />
          )}
        </div>

        {!this.props.readOnly && this.state.focused && (
          <ul className="menu">
            {this.getFilteredOptions().map(opt => (
              <li key={opt} className="menu-item">
                <a className="c-hand" onMouseDown={() => this.add(opt)}>
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
