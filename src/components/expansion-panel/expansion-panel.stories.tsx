import * as React from "react"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0"
import { WrapperStory } from "acp/src/helpers/storybook/story-wrapper"
import { Accordion } from "acp/src/components/expansion-panel"

export default {
  title: "Components/Accordion",
  component: Accordion,
} as Meta

const Template: Story<Accordion> = (args) => (
  <WrapperStory>
    <Accordion {...args}>
      <h1>Set your configuration here</h1>
    </Accordion>
  </WrapperStory>
)

export const Default = Template.bind({})
Default.args = { label: "Settings" }
