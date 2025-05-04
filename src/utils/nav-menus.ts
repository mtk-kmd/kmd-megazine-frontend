import { HomeIcon, Users, Newspaper, LayoutGrid, GalleryVerticalEnd } from 'lucide-react'
import { ROLE } from './constants'

const adminNavItems = [
  {
    title: 'Home',
    url: '/',
    icon: HomeIcon,
    items: [],
  },
  {
    title: 'User Management',
    url: '#',
    icon: Users,
    isActive: true,
    items: [
      { title: 'Students', url: '/students' },
      { title: 'Coordinators', url: '/coordinators' },
      { title: 'Managers', url: '/managers' },
      { title: 'Guests', url: '/guests' },
      { title: 'Admins', url: '/admins' },
    ],
  },
  {
    title: 'Manage Magazines',
    url: '/magazines',
    icon: Newspaper,
    items: [],
  },
  {
    title: 'Faculty Management',
    url: '/faculties',
    icon: LayoutGrid,
    items: [],
  },
  {
    title: 'Contributions',
    url: '/contributions',
    icon: GalleryVerticalEnd,
    items: [],
  },
]

const managerNavItems = [
  {
    title: 'Home',
    url: '/',
    icon: HomeIcon,
    items: [],
  },
  {
    title: 'Contributions',
    url: '/contributions',
    icon: GalleryVerticalEnd,
    items: [],
  },
  {
    title: 'Manage Magazines',
    url: '/magazines',
    icon: Newspaper,
    items: [],
  },
]

const coordinatorNavItems = [
  {
    title: 'Home',
    url: '/',
    icon: HomeIcon,
    items: [],
  },
  {
    title: 'Contributions',
    url: '/contributions',
    icon: GalleryVerticalEnd,
    items: [],
  },
]

const studentNavItems = [
  {
    title: 'Home',
    url: '/',
    icon: HomeIcon,
    items: [],
  },
  {
    title: 'My Contributions',
    url: '/contributions',
    icon: GalleryVerticalEnd,
    items: [],
  },
  {
    title: 'New Magazines',
    url: '/magazines',
    icon: Newspaper,
    items: [],
  },
]

const guestNavItems = [
  {
    title: 'Home',
    url: '/',
    icon: HomeIcon,
    items: [],
  },
  {
    title: 'Contributions',
    url: '/contributions',
    icon: Newspaper,
    items: [],
  },
]

export const navItems = {
  [ROLE.admin]: adminNavItems,
  [ROLE.manager]: managerNavItems,
  [ROLE.marketing_coordinator]: coordinatorNavItems,
  [ROLE.student]: studentNavItems,
  [ROLE.guest]: guestNavItems,
} as const

export type NavItems = (typeof navItems)[keyof typeof navItems]
