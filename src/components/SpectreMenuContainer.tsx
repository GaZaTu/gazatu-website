import * as React from "react";
import { hot } from "react-hot-loader";

export interface Menu {
  id?: string
  children: React.ReactNode
  pos: { x: number, y: number }
  documentClickListener?: () => any
  menuClickListener?: (event: React.MouseEvent) => any
}

interface Props { }

interface State {
  menus: Menu[]
}

class SpectreMenuContainer extends React.PureComponent<Props, State> {
  static instance?: SpectreMenuContainer

  constructor(props: any) {
    super(props)

    this.state = {
      menus: [],
    }

    SpectreMenuContainer.instance = this
  }

  addMenu(menuToAdd: Menu) {
    const hide = () => this.removeMenu(menuToAdd)

    menuToAdd.id = Math.random().toString(36).substr(2, 10)
    menuToAdd.documentClickListener = () => hide()
    menuToAdd.menuClickListener = event => {
      event.preventDefault()
      event.stopPropagation()
      
      return false
    }

    document.addEventListener("click", menuToAdd.documentClickListener)

    this.setState({
      menus: [...this.state.menus, menuToAdd],
    })

    return { hide }
  }

  removeMenu(menuToRemove: Menu) {
    if (menuToRemove.documentClickListener) {
      document.removeEventListener("click", menuToRemove.documentClickListener)
    }
    
    this.setState({
      menus: this.state.menus.filter(menu => menu.id !== menuToRemove.id),
    })
  }

  render() {
    return (
      <div className="spectre-menu-container">
        {this.state.menus.map((menu, index) => (
          <div key={index} style={{ position: "absolute", left: menu.pos.x, top: menu.pos.y, zIndex: 300 + index }} onClick={menu.menuClickListener}>
            {menu.children}
          </div>
        ))}
      </div>
    )
  }
}

export default hot(module)(SpectreMenuContainer)

export function showMenu(children: React.ReactNode, options = {} as Partial<Menu>) {
  if (!SpectreMenuContainer.instance) {
    throw "menu instance undefined"
  }

  return SpectreMenuContainer.instance.addMenu(Object.assign(options, { children }) as any)
}

// showMenu((
//   <ul className="menu">
//     <li className="divider" data-content="LINKS" />
//     <li className="menu-item">
//       <a href="#">
//         <i className="icon icon-link" />Slack
//       </a>
//     </li>
//     <li className="menu-item">
//       <label className="form-checkbox">
//         <input type="checkbox" />
//         <i className="form-icon" />form-checkbox
//       </label>
//     </li>
//     <li className="divider" />
//     <li className="menu-item">
//       <div className="menu-badge">
//         <label className="label label-primary">2</label>
//       </div>
//       <a href="#">
//         <i className="icon icon-link" />Settings
//       </a>
//     </li>
//   </ul>
// ), { pos: { x: 100, y: 100 } })
