import * as React from "react"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0"
import { WrapperStory } from "acp/src/helpers/storybook/story-wrapper"
import { TimePicker } from "acp/src/components/form/inputs/pickers"
import moment, { Moment } from "moment"

export default {
  title: "Components/Form/Inputs/TimePicker",
  component: TimePicker,
} as Meta

const Template: Story<TimePicker> = (args) => (
  <WrapperStory>
    <TimePicker {...args} />
  </WrapperStory>
)

export const Default = Template.bind({})
Default.args = {
  id: "time-picker",
  label: "Time",
  value: moment(),
  onChange: (date) => console.log(date as Moment),
}

export const ShowToday = Template.bind({})
ShowToday.args = {
  id: "time-picker",
  label: "Time",
  showTodayButton: true,
  todayLabel: "Set today",
  value: moment(),
  onChange: (date) => console.log(date as Moment),
}

export const Inline = Template.bind({})
Inline.args = {
  id: "time-picker",
  label: "Time",
  variant: "inline",
  value: moment(),
  onChange: (date) => console.log(date as Moment),
}

export const Static = Template.bind({})
Static.args = {
  id: "time-picker",
  label: "Time",
  variant: "static",
  value: moment(),
  onChange: (date) => console.log(date as Moment),
}

export const Styled = Template.bind({})
Styled.args = {
  id: "time-picker",
  label: "Time",
  value: moment(),
  onChange: (date) => console.log(date as Moment),
  DialogProps: {
    style: { width: 310 },
  },
}
