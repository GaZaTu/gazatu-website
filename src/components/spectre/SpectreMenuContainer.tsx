import * as React from "react";

export interface Menu {
  id?: string
  children: React.ReactNode
  pos: { pageX: number, pageY: number }
  documentClickListener?: () => any
  menuClickListener?: (event: React.MouseEvent) => any
  removePrevious?: boolean
  style?: React.CSSProperties
  adjustedPos?: boolean
  adjustLeft?: (el: HTMLElement, rect: ClientRect | DOMRect) => number
  adjustTop?: (el: HTMLElement, rect: ClientRect | DOMRect) => number
}

interface Props { }

interface State {
  menus: Menu[]
}

export default class SpectreMenuContainer extends React.PureComponent<Props, State> {
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
    menuToAdd.documentClickListener = menuToAdd.documentClickListener || (() => hide())
    menuToAdd.menuClickListener = menuToAdd.menuClickListener || (event => {
      event.preventDefault()
      event.stopPropagation()

      return false
    })

    document.addEventListener("click", menuToAdd.documentClickListener)
    document.addEventListener("contextmenu", menuToAdd.documentClickListener)

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
      document.removeEventListener("contextmenu", menuToRemove.documentClickListener)
    }

    this.setState({
      menus: this.state.menus.filter(menu => menu.id !== menuToRemove.id),
    })
  }

  makeMenuStyle(menu: Menu, index: number) {
    const pos = menu.pos

    return {
      position: "absolute" as any,
      left: pos.pageX,
      top: pos.pageY,
      zIndex: 300 + index,
    }
  }

  getMenuRef(menu: Menu, el: HTMLElement | null) {
    if (el && !menu.adjustedPos) {
      const menuRect = el.getBoundingClientRect()
      const menuStyle = (menu.style = menu.style || {})

      if (menuRect.right > window.innerWidth) {
        if (menu.adjustLeft) {
          menuStyle.left = menu.adjustLeft(el, menuRect)
        } else {
          menuStyle.left = el.offsetLeft - (menuRect.right - window.innerWidth) - 26
        }
      }

      if (menuRect.bottom > window.innerHeight) {
        if (menu.adjustTop) {
          menuStyle.top = menu.adjustTop(el, menuRect)
        } else {
          menuStyle.top = el.offsetTop - (menuRect.bottom - window.innerHeight) - 26
        }
      }

      menu.adjustedPos = true

      this.setState({
        menus: this.state.menus.slice(),
      })
    }

    return menu.id
  }

  render() {
    return (
      <div className="spectre-menu-container">
        {this.state.menus.map((menu, index) => (
          <div key={menu.id} ref={el => this.getMenuRef(menu, el)} className="float-menu" style={Object.assign(this.makeMenuStyle(menu, index), menu.style)} onClick={menu.menuClickListener}>
            {menu.children}
          </div>
        ))}
      </div>
    )
  }
}

export function showMenu(children: React.ReactNode, options = {} as Partial<Menu>) {
  if (!SpectreMenuContainer.instance) {
    throw "menu instance undefined"
  }

  return SpectreMenuContainer.instance.addMenu(Object.assign(options, { children }) as any)
}
