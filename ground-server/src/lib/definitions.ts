import { type ReactNode } from 'react'
import { type Layout } from 'react-grid-layout'

export type Widget = {
    children: ReactNode
    layout: Layout
}
