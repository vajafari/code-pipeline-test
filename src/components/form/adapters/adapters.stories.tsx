import * as React from "react"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0"
import { styled } from "@material-ui/core"
import moment from "moment"
import * as form from "acp/src/components/form"
import { WrapperStory } from "acp/src/helpers/storybook/story-wrapper"

const fields: form.Generator["fields"] = [
  {
    component: form.fieldType.TimePicker,
    name: "time",
    label: "Time",
    componentProps: {},
  },
  {
    component: form.fieldType.DatePicker,
    name: "date",
    label: "Date",
    componentProps: {
      required: true,
    },
  },
  {
    component: form.fieldType.TextField,
    name: "order",
    label: "Order (1-10)",
    componentProps: {
      required: true,
      type: "number",
      inputProps: {
        min: 1,
        max: 10,
      },
    },
  },
  {
    component: form.fieldType.TextField,
    name: "pattern",
    label: "Number (with a pattern [2-8]*)",
    componentProps: {
      required: true,
      inputProps: {
        inputMode: "numeric",
        pattern: "[2-8]*",
      },
    },
  },
  {
    component: form.fieldType.TextField,
    name: "phone",
    label: "Phone number",
    componentProps: {
      required: true,
      mask: ["(", /[1-9]/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
    },
  },
  {
    component: form.fieldType.Autocomplete,
    name: "category",
    label: "Select category",
    componentProps: {
      options: ["category 1", "category 2", "category 3"],
    },
  },
  {
    component: form.fieldType.Autocomplete,
    name: "categories",
    label: "Select categories",
    componentProps: {
      options: ["category 1", "category 2", "category 3"],
      multiple: true,
    },
  },
  {
    component: form.fieldType.Select,
    name: "options",
    label: "Select options",
    componentProps: {
      options: [
        { value: "1", label: "Option 1", tooltip: "Tooltip for option 1" },
        { value: "2", label: "Option 2" },
        { value: "3", label: "Option 3" },
        { value: "4", label: "Option 4" },
      ],
    },
  },
  {
    component: form.fieldType.Checkbox,
    name: "enabled",
    label: "Enabled",
    componentProps: {
      required: true,
    },
  },
  {
    component: form.fieldType.MultipleChipSelect,
    name: "multipleOptions",
    label: "Select multiple options",
    componentProps: {
      options: [
        { value: 1, label: "Option 1" },
        { value: 2, label: "Option 2" },
        { value: 3, label: "Option 3" },
        { value: 4, label: "Option 4" },
        { value: 5, label: "Option 5" },
        { value: 6, label: "Option 6" },
      ],
    },
  },
  {
    component: form.fieldType.RadioGroup,
    name: "radios",
    label: "Radio Buttons",
    componentProps: {
      required: true,
      options: [
        { value: 1, label: "Option 1", caption: "Some captions here..." },
        { value: 2, label: "Option 2", caption: "Some captions here..." },
        { value: 3, label: "Option 3", caption: "Some captions here..." },
        { value: 4, label: "Option 4" },
        { value: 5, label: "Option 5" },
        { value: 6, label: "Option 6", disabled: true },
      ],
    },
  },
]

const fieldsWithFieldArray: form.Generator["fields"] = [
  {
    fieldArray: true,
    disableFirstAdd: true,
    name: `variables`,
    fields: [
      {
        component: form.fieldType.Checkbox,
        name: `isRequired`,
        label: `Required?`,
      },
      {
        component: form.fieldType.TextField,
        name: `title`,
        label: `Title`,
      },
      {
        component: form.fieldType.Select,
        name: `variableType`,
        label: `Type`,
        componentProps: {
          options: [
            { label: `Select`, value: `Select` },
            { label: `List`, value: `StringArray` },
          ],
        },
      },
      {
        validation: {
          field: `variableType`,
          value: `Select`,
          fieldArray: true,
        },
        component: form.fieldType.MultipleChipSelect,
        name: `values`,
        label: `Values`,
        componentProps: {
          options: [
            { label: `Option 1`, value: `1` },
            { label: `Option 2`, value: `2` },
            { label: `Option 3`, value: `3` },
          ],
        },
      },
    ],
  },
]

const fieldsWithFieldArrayEnableFirstAdd: form.Generator["fields"] = [
  {
    fieldArray: true,
    name: `variables`,
    fields: [
      {
        component: form.fieldType.Checkbox,
        name: `isRequired`,
        label: `Required?`,
      },
      {
        component: form.fieldType.TextField,
        name: `title`,
        label: `Title`,
      },
      {
        component: form.fieldType.Select,
        name: `variableType`,
        label: `Type`,
        componentProps: {
          options: [
            { label: `Select`, value: `Select` },
            { label: `List`, value: `StringArray` },
          ],
        },
      },
      {
        validation: {
          field: `variableType`,
          value: `Select`,
          fieldArray: true,
        },
        component: form.fieldType.MultipleChipSelect,
        name: `values`,
        label: `Values`,
        componentProps: {
          options: [
            { label: `Option 1`, value: `1` },
            { label: `Option 2`, value: `2` },
            { label: `Option 3`, value: `3` },
          ],
        },
      },
    ],
  },
]

const fieldsWithNestedFieldArray: form.Generator["fields"] = [
  {
    fieldArray: true,
    disableFirstAdd: true,
    name: `variables`,
    fields: [
      {
        component: form.fieldType.TextField,
        name: `title`,
        label: `Title`,
      },
      {
        fieldArray: true,
        disableFirstAdd: true,
        name: `types`,
        fields: [
          {
            component: form.fieldType.TextField,
            name: `typeTitle`,
            label: `Type Title`,
          },
          {
            component: form.fieldType.Select,
            name: `variableType`,
            label: `Type`,
            componentProps: {
              options: [
                { label: `Select`, value: `Select` },
                { label: `List`, value: `StringArray` },
              ],
            },
          },
        ],
      },
    ],
  },
]

const fieldsWithSection: form.Generator["fields"] = [
  [
    {
      label: "Collapsed Section",
      defaultExpanded: false,
    },
    [
      {
        component: form.fieldType.TimePicker,
        name: "time",
        label: "Time",
        componentProps: {},
      },
    ],
  ],
  [
    {
      label: "Expanded Section",
      defaultExpanded: true,
    },
    [
      {
        component: form.fieldType.Select,
        name: "options",
        label: "Select options",
        componentProps: {
          options: [
            { value: "1", label: "Option 1" },
            { value: "2", label: "Option 2" },
            { value: "3", label: "Option 3" },
            { value: "4", label: "Option 4" },
          ],
        },
      },
    ],
  ],
]

const fieldsWithTabSection: form.Generator["fields"] = [
  [
    {
      label: "Tab Section",
      defaultExpanded: true,
    },
    [
      [
        {
          label: "Tab One",
        },
        [
          {
            component: form.fieldType.TimePicker,
            name: "time",
            label: "Time",
            componentProps: {},
          },
        ],
      ],
      [
        {
          label: "Tab Two",
        },
        [
          {
            component: form.fieldType.Select,
            name: "options",
            label: "Select options",
            componentProps: {
              options: [
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
                { value: "4", label: "Option 4" },
              ],
            },
          },
        ],
      ],
    ],
  ],
]

const fieldsWithTabSectionAndValidation: form.Generator["fields"] = [
  [
    {
      label: "Tab Section",
      defaultExpanded: true,
    },
    [
      [
        {
          label: "Tab One",
        },
        [
          {
            component: form.fieldType.Select,
            name: "options",
            label: "Select option 1 for tab two",
            componentProps: {
              options: [
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
                { value: "4", label: "Option 4" },
              ],
            },
          },
        ],
      ],
      [
        {
          label: "Tab Two",
          validation: {
            field: "options",
            value: "1",
          },
        },
        [
          {
            component: form.fieldType.TimePicker,
            name: "time",
            label: "Time",
            componentProps: {},
          },
        ],
      ],
    ],
  ],
]

const fieldsWithValidation: form.Generator["fields"] = [
  {
    component: form.fieldType.Checkbox,
    name: "hasCategory",
    label: "has category?",
  },
  {
    component: form.fieldType.Autocomplete,
    name: "category",
    label: "Select category",
    validation: {
      field: "hasCategory",
      value: true,
    },
    componentProps: {
      options: ["category 1", "category 2", "category 3"],
    },
  },
]

const fieldsWithSectionAndValidation: form.Generator["fields"] = [
  [
    {
      label: "First Section",
      defaultExpanded: true,
    },
    [
      {
        component: form.fieldType.Checkbox,
        name: "hasCategory",
        label: "has category?",
      },
    ],
  ],
  [
    {
      label: "Validation Section",
      defaultExpanded: true,
      validation: {
        field: "hasCategory",
        value: true,
      },
    },
    [
      {
        component: form.fieldType.Select,
        name: "category",
        label: "Select category",
        componentProps: {
          options: [
            { value: "1", label: "Option 1" },
            { value: "2", label: "Option 2" },
            { value: "3", label: "Option 3" },
            { value: "4", label: "Option 4" },
          ],
        },
      },
    ],
  ],
]

const onSubmit = (values: any) => {
  console.log(`values`, values)
}

export default {
  title: "Components/Form/Adapters",
  component: form.Generator,
} as Meta

const Template: Story<form.Generator> = (args) => (
  <WrapperStory>
    <form.Generator {...args} />
  </WrapperStory>
)

export const Default = Template.bind({})
Default.args = {
  fields: fields,
  onSubmit: onSubmit,
}

export const Validation = Template.bind({})
Validation.args = {
  fields: fieldsWithValidation,
  onSubmit: onSubmit,
  initialValues: {
    hasCategory: true,
  },
}

const StyledForm = styled(form.Generator)({
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `center`,
  alignItems: `center`,
  width: "90%",
})

const StyledTemplate: Story<form.Generator> = (args) => (
  <WrapperStory>
    <StyledForm {...args} />
  </WrapperStory>
)

export const FieldArrayDisableFirstAdd = StyledTemplate.bind({})
FieldArrayDisableFirstAdd.args = {
  fields: fieldsWithFieldArray,
  onSubmit: onSubmit,
}

export const FieldArrayEnableFirstAdd = StyledTemplate.bind({})
FieldArrayEnableFirstAdd.args = {
  fields: fieldsWithFieldArrayEnableFirstAdd,
  onSubmit: onSubmit,
}

export const NestedFieldArray = StyledTemplate.bind({})
NestedFieldArray.args = {
  fields: fieldsWithNestedFieldArray,
  onSubmit: onSubmit,
}

export const Styled = StyledTemplate.bind({})
Styled.args = {
  fields: fields,
  onSubmit: onSubmit,
  FormControlsProps: { title: "Save", submitButtonProps: { color: "secondary" } },
}

export const StyledWithInitialValue = StyledTemplate.bind({})
StyledWithInitialValue.args = {
  fields: fields,
  onSubmit: onSubmit,
  FormControlsProps: { title: "Save", submitButtonProps: { color: "secondary" } },
  initialValues: {
    time: moment(),
    date: moment().date,
    phone: "1234567890",
    category: "category 1",
    options: "Option 2",
    multipleOptions: [2, 4, 6],
    enabled: true,
    radios: 4,
  },
}

export const Sections = StyledTemplate.bind({})
Sections.args = {
  fields: fieldsWithSection,
  onSubmit: onSubmit,
}

export const SectionWithValidation = StyledTemplate.bind({})
SectionWithValidation.args = {
  fields: fieldsWithSectionAndValidation,
  onSubmit: onSubmit,
}

export const Tabs = StyledTemplate.bind({})
Tabs.args = {
  fields: fieldsWithTabSection,
  onSubmit: onSubmit,
}

export const TabsWithValidation = StyledTemplate.bind({})
TabsWithValidation.args = {
  fields: fieldsWithTabSectionAndValidation,
  onSubmit: onSubmit,
}
