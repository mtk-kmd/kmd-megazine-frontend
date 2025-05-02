'use client'
import dynamic from 'next/dynamic'
import type * as React from 'react'
import {
  GalleryVerticalEnd,
  HomeIcon,
  LayoutGrid,
  Newspaper,
  Users,
} from 'lucide-react'

import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { AppLogo } from './app-logo'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

import { useSession } from 'next-auth/react'
import { useGetUser } from '@/features/users/api/users'
import { Skeleton } from '../ui/skeleton'
import { navItems } from '@/utils/nav-menus'

const SidebarMenuSkeleton = dynamic(
  () =>
    import('@/components/ui/sidebar').then((mod) => mod.SidebarMenuSkeleton),
  { ssr: false }
)

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession()
  const accessToken = session?.data?.user.token as string
  const userId = session?.data?.user?.data?.user_id as number

  const {
    data: user,
    isPending,
    error,
    isSuccess,
  } = useGetUser(accessToken, userId, !!accessToken)

  if (isPending) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <AppLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Skeleton className="h-4 w-20" />
            </SidebarGroupLabel>
            <SidebarMenu>
              {[...Array(5)].map((_, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }

  if (error) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <AppLogo />
        </SidebarHeader>
        <SidebarContent>
          <div>Error: {error.message}</div>
        </SidebarContent>
      </Sidebar>
    )
  }

  if (isSuccess && user) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <AppLogo />
        </SidebarHeader>
        <SidebarContent>
          <NavMain
            items={navItems[user.result.role?.role_id as keyof typeof navItems]}
          />
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              name: user.result.user_name,
              email: user.result.email,
              avatar: '',
            }}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
  }

  return null
}
