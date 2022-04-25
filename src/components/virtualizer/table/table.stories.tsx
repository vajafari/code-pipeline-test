import * as React from "react"
import { Story, Meta } from "@storybook/react/types-6-0"
import { WrapperStory } from "acp/src/helpers/storybook/story-wrapper"

import { VirtualizerTable } from "./virtualizer-table"

export default {
  title: "Components/VirtualizerTable",
  component: VirtualizerTable,
} as Meta

const commonProps: VirtualizerTable = {
  columns: [
    { label: `Field Type`, accessor: `fieldType` },
    { label: `Name`, accessor: `name` },
    { label: `Icon`, accessor: `icon` },
    { label: `Values`, accessor: `values` },
    { label: `View Level`, accessor: `viewLevel` },
  ],
  data: [],
}

const dataIncremental = []
let values = ``
for (let i = 0; i < 100; i++) {
  values += `${i} \n`
  dataIncremental.push({
    fieldType: `Field type${i}`,
    name: `Name${i}`,
    icon: `Icon${i}`,
    values: values,
    viewLevel: `All${i}`,
  })
}

const Template: Story<VirtualizerTable> = (args) => (
  <WrapperStory>
    <VirtualizerTable {...args} />
  </WrapperStory>
)

export const differentRowHeights = Template.bind({})
differentRowHeights.args = { ...commonProps, data: dataIncremental }

const dataFixed = []
for (let i = 0; i < 1000; i++) {
  dataFixed.push({
    fieldType: `Field type${i}`,
    name: `Name${i}`,
    icon: `Icon${i}`,
    values: `Value${i}`,
    viewLevel: `All${i}`,
  })
}

export const fixedRowHeights = Template.bind({})
fixedRowHeights.args = { ...commonProps, data: dataFixed }
