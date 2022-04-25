import * as React from "react"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0"
import { AuthState } from "@aws-amplify/ui-components"
import { WrapperStory } from "acp/src/helpers/storybook/story-wrapper"

import { Header, HeaderProps } from "./header"

export default {
  title: "Components/Dashboard/Header",
  component: Header,
} as Meta

const Template: Story<HeaderProps> = (args) => (
  <WrapperStory>
    <Header {...args} />
  </WrapperStory>
)

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  username: "Some User",
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {}
