import * as React from "react"
import moment from "moment"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0"
import { WrapperStory } from "acp/src/helpers/storybook/story-wrapper"
import { DatePicker } from "acp/src/components/form/inputs/pickers"

export default {
  title: "Components/Form/Inputs/DatePicker",
  component: DatePicker,
} as Meta

const Template: Story<DatePicker> = (args) => (
  <WrapperStory>
    <DatePicker {...args} />
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

export const EndOfDay = Template.bind({})
EndOfDay.args = {
  label: "End of today",
  value: null,
  endOfDay: true,
}

export const Inline = Template.bind({})
Inline.args = {
  label: "Inline",
  value: null,
  variant: "inline",
}

export const Static = Template.bind({})
Static.args = {
  label: "Static",
  value: null,
  variant: "static",
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
