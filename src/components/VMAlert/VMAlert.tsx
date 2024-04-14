// STYLES
import './VMAlert.scss'

import { propsFactory, createComponent } from '@/utils'

import { VMAlertName, VMAlertProps } from './VMAlert.constants'
import { h } from 'vue'

export const makeVMAlertProps = propsFactory(VMAlertProps, VMAlertName)

export const VMAlert = createComponent({
  name: 'VMAlert',

  props: makeVMAlertProps(),

  setup(props: any, { slots }: { slots: any }) {
    return () => {
      return h(
        'div',
        {
          class: [
            'vm-alert',
            `vm-alert--${props.type}`,
            props.show ? 'vm-alert--show' : '',
          ],
        },
        [
          slots.title && slots.title(),
          h(
            'div',
            { class: 'vm-alert__message' },
            slots.default && slots.default()
          ),
        ]
      )
    }
  },
})

export type VMAlert = InstanceType<typeof VMAlert>
