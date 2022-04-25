import * as React from "react"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0"
import { WrapperStory } from "acp/src/helpers/storybook/story-wrapper"
import { MultipleChipSelect } from "acp/src/components/form/inputs/multiple-chip-select"

export default {
  title: "Components/Form/Inputs/MultipleChipSelect",
  component: MultipleChipSelect,
} as Meta

const Template: Story<MultipleChipSelect> = (args) => (
  <WrapperStory>
    <MultipleChipSelect {...args} />
  </WrapperStory>
)

let value: React.ReactText[] = []
const handleChange = (event: any) => {
  value = (event.target.value as unknown) as React.ReactText[]
}

export const Default = Template.bind({})
Default.args = {
  options: [
    { value: 1, label: `Option 1` },
    { value: 2, label: `Option 2` },
    { value: 3, label: `Option 3` },
    { value: 4, label: `Option 4` },
  ],
  required: true,
  value: value,
  onChange: handleChange,
}

export const Required = Template.bind({})
Required.args = {
  options: [
    { value: 1, label: `Option 1` },
    { value: 2, label: `Option 2` },
    { value: 3, label: `Option 3` },
    { value: 4, label: `Option 4` },
  ],
  required: true,
}

export const NotRequired = Template.bind({})
NotRequired.args = {
  options: [
    { value: 1, label: `Option 1` },
    { value: 2, label: `Option 2` },
    { value: 3, label: `Option 3` },
    { value: 4, label: `Option 4` },
  ],
  required: false,
}

export const InitialedValue = Template.bind({})
InitialedValue.args = {
  options: [
    { value: 1, label: `Option 1` },
    { value: 2, label: `Option 2` },
    { value: 3, label: `Option 3` },
    { value: 4, label: `Option 4` },
  ],
  required: true,
  value: [1, 2],
}

export const FixedOptions = Template.bind({})
FixedOptions.args = {
  options: [
    { value: 1, label: `Option 1` },
    { value: 2, label: `Option 2` },
    { value: 3, label: `Option 3` },
    { value: 4, label: `Option 4` },
  ],
  fixedOptions: [{ value: 2, label: `Option 2` }],
  required: true,
  value: [1, 2],
}
