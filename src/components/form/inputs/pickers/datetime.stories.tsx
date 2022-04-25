import * as React from "react"
import moment from "moment"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0"
import { WrapperStory } from "acp/src/helpers/storybook/story-wrapper"
import { DatetimePicker } from "acp/src/components/form/inputs/pickers"

export default {
  title: "Components/Form/Inputs/DatetimePicker",
  component: DatetimePicker,
} as Meta

const Template: Story<DatetimePicker> = (args) => (
  <WrapperStory>
    <DatetimePicker {...args} />
  </WrapperStory>
)

export const Default = Template.bind({})
Default.args = {
  label: "Default",
  value: null,
}

export const Now = Template.bind({})
Now.args = {
  label: "Now",
  value: moment(),
}

export const Inline = Template.bind({})
Inline.args = {
  label: "Inline",
  value: null,
  variant: "inline",
}

export const ShowToday = Template.bind({})
ShowToday.args = {
  label: "Show today",
  value: null,
  showTodayButton: true,
}

export const Styled = Template.bind({})
Styled.args = {
  label: "Styled",
  value: null,
  DialogProps: {
    style: { width: 400 },
  },
}
