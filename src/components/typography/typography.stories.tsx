import * as React from "react"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0"
import { WrapperStory } from "acp/src/helpers/storybook/story-wrapper"
import { Typography, TypographyProps } from "@material-ui/core"

export default {
  title: "Components/Typography",
  component: Typography,
} as Meta

const Template: Story<TypographyProps> = (args) => (
  <WrapperStory>
    <Typography {...args}>Text</Typography>
  </WrapperStory>
)

export const H1 = Template.bind({})
H1.args = {
  variant: "h1",
}

export const H2 = Template.bind({})
H2.args = {
  variant: "h2",
}

export const H3 = Template.bind({})
H3.args = {
  variant: "h3",
}

export const H4 = Template.bind({})
H4.args = {
  variant: "h4",
}

export const H5 = Template.bind({})
H5.args = {
  variant: "h5",
}

export const H6 = Template.bind({})
H6.args = {
  variant: "h6",
}

export const body1 = Template.bind({})
body1.args = {
  variant: "body1",
}

export const body2 = Template.bind({})
body2.args = {
  variant: "body2",
}
