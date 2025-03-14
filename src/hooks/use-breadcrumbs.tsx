'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

type BreadcrumbItem = {
  title: string
  link: string
}

const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/': [{ title: 'Home', link: '/' }],
  '/contributions': [{ title: 'Contributions', link: '/contributions' }],
  '/students': [
    { title: 'Home', link: '/' },
    { title: 'Students', link: '/students' },
  ],
  '/coordinators': [
    { title: 'Home', link: '/' },
    { title: 'Coordinators', link: '/coordinators' },
  ],
  '/managers': [
    { title: 'Home', link: '/' },
    { title: 'Managers', link: '/managers' },
  ],
  '/guests': [
    { title: 'Home', link: '/' },
    { title: 'Guests', link: '/guests' },
  ],
  '/events': [
    { title: 'Home', link: '/' },
    { title: 'Events', link: '/events' },
  ],
  '/faculties': [
    { title: 'Home', link: '/' },
    { title: 'Falculty Management', link: '/faculties' },
  ],
}

export function useBreadcrumbs() {
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname]
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean)
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path,
      }
    })
  }, [pathname])

  return breadcrumbs
}
