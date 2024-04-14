import { defineComponent, markRaw } from 'vue'

export function createComponent(raw: any) {
  return markRaw(defineComponent(raw))
}
export function createDirective(raw: any) {
  return markRaw(raw)
}
