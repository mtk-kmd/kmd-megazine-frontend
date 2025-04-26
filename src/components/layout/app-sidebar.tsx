'use client'

import type * as React from 'react'
import {
  AudioWaveform,
  BookOpenIcon,
  Command,
  GalleryVerticalEnd,
  HomeIcon,
  LayoutGrid,
  PartyPopper,
  Users,
} from 'lucide-react'

import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: HomeIcon,
      items: [],
    },
    {
      title: 'Contributions',
      url: '/contributions',
      icon: BookOpenIcon,
      items: [],
    },
    {
      title: 'User Management',
      url: '#',
      icon: Users,
      isActive: true,
      items: [
        {
          title: 'Students',
          url: '/students',
        },
        {
          title: 'Coordinators',
          url: '/coordinators',
        },
        {
          title: 'Managers',
          url: '/managers',
        },
        {
          title: 'Guests',
          url: '/guests',
        },
      ],
    },
    {
      title: 'Events',
      url: '/events',
      icon: PartyPopper,
      items: [],
    },
    {
      title: 'Faculty Management',
      url: '/faculties',
      icon: LayoutGrid,
      items: [],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
