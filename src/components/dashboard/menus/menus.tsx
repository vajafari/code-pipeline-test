import { List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer } from "@material-ui/core"
import * as Icons from "@material-ui/icons/"
import { Routes } from "acp/src/constants/routes"
import { DisplayInfoType } from "acp/src/helpers/hooks/use-entity"
import React from "react"
import { Link } from "wouter"
import * as Styled from "./styles"
type IconType = typeof import("@material-ui/icons/index")

export interface MenusProps {
  menus: DisplayInfoType[]
  open: boolean
  onToggleDrawerMenu: (open: boolean) => (event: any) => void
}

export const Menus = (props: MenusProps): React.ReactElement => {
  const classes = Styled.useStyles()
  const { menus, open, onToggleDrawerMenu } = props
  const refTableHeadCell = React.useRef<HTMLDivElement>()
  return (
    <div>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={onToggleDrawerMenu(false)}
        onOpen={onToggleDrawerMenu(true)}
        ref={refTableHeadCell}
      >
        <div
          className={classes.list}
          role="presentation"
          onClick={onToggleDrawerMenu(false)}
          onKeyDown={onToggleDrawerMenu(false)}
        >
          <List>
            {menus
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((menu, index) => (
                <Link key={index} to={Routes.EntityView(menu.entityName)}>
                  <ListItem button key={index}>
                    <ListItemIcon>
                      {React.createElement(Icons[menu.icon as keyof IconType] || Icons["Apps"])}
                    </ListItemIcon>
                    <ListItemText primary={menu.displayName} />
                  </ListItem>
                </Link>
              ))}
          </List>
        </div>
      </SwipeableDrawer>
    </div>
  )
}
