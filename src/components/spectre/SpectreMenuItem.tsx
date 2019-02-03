import * as React from "react";
import { hot } from "react-hot-loader";
import * as classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  children?: React.ReactNode
  badge?: React.ReactNode
  badgeKind?: "primary" | "secondary" | "success" | "warning" | "error" | "checkbox"
  badgeCheckboxChecked?: boolean
  badgeCheckboxOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

class SpectreMenuItem extends React.PureComponent<Props> {
  render() {
    const { children, badge, badgeKind, badgeCheckboxChecked, badgeCheckboxOnChange, ...nativeProps } = this.props
    const className = classNames("menu-item", nativeProps.className)

    return (
      <li {...nativeProps} className={className}>
        {badge && (
          <div className="menu-badge">
            {(badgeKind === "checkbox") ? (
              <label className="form-checkbox">
                <input type="checkbox" checked={badgeCheckboxChecked} onChange={badgeCheckboxOnChange} />
                <i className="form-icon" />
                {badge}
              </label>
            ) : (
                <label className={`label ${badgeKind ? `label-${badgeKind}` : ""}`}>{badge}</label>
              )}
          </div>
        )}
        {children}
      </li>
    )
  }
}

export default hot(module)(SpectreMenuItem)
