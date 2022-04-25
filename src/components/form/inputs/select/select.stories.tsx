import * as React from "react"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0"
import { WrapperStory } from "acp/src/helpers/storybook/story-wrapper"
import { Select } from "acp/src/components/form/inputs/select"

export default {
  title: "Components/Form/Inputs/Select",
  component: Select,
} as Meta

const Template: Story<Select> = (args) => {
  const [selectedValue, setSelectedValue] = React.useState<string>("")

  const handleSetSelectionValue = (event: any) => {
    setSelectedValue(event?.target?.value)
  }

  return (
    <WrapperStory>
      <Select {...args} value={selectedValue} onChange={handleSetSelectionValue} />
    </WrapperStory>
  )
}

export const Default = Template.bind({})
Default.args = {
  options: [
    { value: "1", label: `Option 1` },
    { value: "2", label: `Option 2` },
  ],
  required: true,
}

export const Required = Template.bind({})
Required.args = {
  options: [
    { value: "1", label: `Option 1` },
    { value: "2", label: `Option 2` },
  ],
  required: true,
}

export const NotRequired = Template.bind({})
NotRequired.args = {
  options: [
    { value: "1", label: `Option 1` },
    { value: "2", label: `Option 2` },
  ],
  required: false,
  onClearSelection: () => true,
}
