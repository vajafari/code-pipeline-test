import * as React from "react"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0"
import { IconButton } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import { WrapperStory } from "acp/src/helpers/storybook/story-wrapper"

import { Menus, MenusProps } from "./menus"

export default {
  title: "Components/Dashboard/Menus",
  component: Menus,
} as Meta

const menus = [
  {
    entityName: "address",
    displayName: "Address",
    icon: "ContactMail",
    displayOrder: 0,
  },
  {
    entityName: "product",
    displayName: "Product",
    icon: "Shop",
    displayOrder: 2,
  },
  {
    entityName: "category",
    displayName: "Category",
    icon: "Category",
    displayOrder: 3,
  },
  {
    entityName: "users",
    displayName: "Users",
    icon: "Person",
    displayOrder: 1,
  },
]

const Template: Story<MenusProps> = (args) => (
  <WrapperStory>
    <Menus {...args} />
  </WrapperStory>
)

export const OpenByDefault = Template.bind({})
OpenByDefault.args = {
  menus: menus,
  open: true,
  onToggleDrawerMenu: () => () => {
    return null
  },
}

const TemplateWithButton: Story<MenusProps> = (args) => {
  const [openMenu, setOpenMenu] = React.useState(false)

  return (
    <WrapperStory>
      <IconButton onClick={() => setOpenMenu(true)}>
        <MenuIcon />
      </IconButton>
      <Menus {...args} open={openMenu} />
    </WrapperStory>
  )
}
export const OpenByMenuIcon = TemplateWithButton.bind({})
OpenByMenuIcon.args = {
  menus: menus,
  onToggleDrawerMenu: () => () => {
    return null
  },
}
