import * as React from "react"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0"
import { WrapperStory } from "acp/src/helpers/storybook/story-wrapper"
import { TextField } from "acp/src/components/form/inputs/text-field"

export default {
  title: "Components/Form/Inputs/TextField",
  component: TextField,
} as Meta

const Template: Story<TextField> = (args) => (
  <WrapperStory>
    <TextField {...args} />
  </WrapperStory>
)

export const Default = Template.bind({})
Default.args = {
  placeholder: "Default",
  required: true,
}

export const WithoutBorder = Template.bind({})
WithoutBorder.args = {
  placeholder: "Without Border",
  hideBorder: true,
}

export const SecondaryColor = Template.bind({})
SecondaryColor.args = {
  placeholder: "Secondary Color",
  color: "secondary",
}
