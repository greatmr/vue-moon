import type { PropType } from 'vue'

// TYPES
export type VMAlertType = 'info' | 'success' | 'warning' | 'error'

export const VMAlertName = 'VMAlert' as const
export const VMAlertTypes = [
  'info',
  'success',
  'warning',
  'error',
] as VMAlertType[]

export const VMAlertProps = {
  type: {
    type: [Boolean, String] as PropType<VMAlertType>,
    validator: (val: VMAlertType) => {
      return VMAlertTypes.includes(val)
    },
  },
} as const
