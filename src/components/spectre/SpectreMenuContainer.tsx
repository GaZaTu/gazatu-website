import * as React from "react";
import { hot } from "react-hot-loader";

export interface Menu {
  id?: string
  children: React.ReactNode
  pos: { x: number, y: number } | { clientX: number, clientY: number }
  documentClickListener?: () => any
  menuClickListener?: (event: React.MouseEvent) => any
  removePrevious?: boolean
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
    menuToAdd.pos = Object.assign({}, menuToAdd.pos)
    menuToAdd.documentClickListener = () => hide()
    menuToAdd.menuClickListener = event => {
      event.preventDefault()
      event.stopPropagation()

      return false
    }

    document.addEventListener("click", menuToAdd.documentClickListener)

    if (menuToAdd.removePrevious) {
      for (const menu of this.state.menus) {
        this.removeMenu(menu)
      }

      this.setState({
        menus: [menuToAdd],
      })
    } else {
      this.setState({
        menus: [...this.state.menus, menuToAdd],
      })
    }


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

  makeMenuStyle(menu: Menu, index: number) {
    const pos = menu.pos as any

    return {
      position: "absolute" as any,
      left: pos.x || pos.clientX,
      top: pos.y || pos.clientY,
      zIndex: 300 + index,
    }
  }

  render() {
    return (
      <div className="spectre-menu-container">
        {this.state.menus.map((menu, index) => (
          <div key={index} style={this.makeMenuStyle(menu, index)} onClick={menu.menuClickListener}>
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
