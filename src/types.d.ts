import type React from "react"
declare module "class-variance-authority" {
  export function cva(...args: any[]): any
  export type VariantProps<T> = T extends (...args: any[]) => infer P ? P : never
}

declare module "@radix-ui/react-checkbox" {
  export interface CheckboxProps extends React.ComponentPropsWithoutRef<"button"> {
    checked?: boolean
    defaultChecked?: boolean
    required?: boolean
    name?: string
    value?: string
    onCheckedChange?(checked: boolean | "indeterminate"): void
    disabled?: boolean
  }

  export interface CheckboxIndicatorProps {
    forceMount?: true
  }

  export const Checkbox: React.ForwardRefExoticComponent<CheckboxProps>
  export const CheckboxIndicator: React.ForwardRefExoticComponent<CheckboxIndicatorProps>
}

declare module "@radix-ui/react-label" {
  export interface LabelProps extends React.ComponentPropsWithoutRef<"label"> {
    htmlFor?: string
  }

  export const Label: React.ForwardRefExoticComponent<LabelProps>
}

declare module "@radix-ui/react-slot" {
  export interface SlotProps {
    children?: React.ReactNode
  }

  export const Slot: React.ForwardRefExoticComponent<SlotProps>
}

