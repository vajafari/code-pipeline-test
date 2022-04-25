import * as React from "react"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0"
import { WrapperStory } from "acp/src/helpers/storybook/story-wrapper"
import { IconButton, IconButtonProps } from "@material-ui/core"
import MoodIcon from "@material-ui/icons/Mood"

export default {
  title: "Components/IconButton",
  component: IconButton,
} as Meta

const Template: Story<IconButtonProps> = (args) => (
  <WrapperStory>
    <IconButton {...args}>
      <MoodIcon />
    </IconButton>
  </WrapperStory>
)

export const Default = Template.bind({})
Default.args = {}

export const Primary = Template.bind({})
Primary.args = {
  color: "primary",
}

export const Secondary = Template.bind({})
Secondary.args = {
  color: "secondary",
}
