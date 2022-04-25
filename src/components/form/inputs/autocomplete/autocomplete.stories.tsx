import * as React from "react"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0"
import { WrapperStory } from "acp/src/helpers/storybook/story-wrapper"
import { Autocomplete } from "acp/src/components/form/inputs/autocomplete"

export default {
  title: "Components/Form/Inputs/Autocomplete",
  component: Autocomplete,
} as Meta

const Template: Story<Autocomplete> = (args) => (
  <WrapperStory>
    <Autocomplete {...args} />
  </WrapperStory>
)

const oprtions = [`Option 1`, `Option 2`, `Option 3`, `Option 4`]

export const Default = Template.bind({})
Default.args = {
  label: "Default",
  options: oprtions,
}
