import { Metadata } from 'next'
import { Falculty } from '@/features/falculty/components'

export const metadata: Metadata = {
  title: 'Faculties',
  description: 'Explore the list of faculties',
}

export default function FalcultiesPage() {
  return <Falculty />
}
