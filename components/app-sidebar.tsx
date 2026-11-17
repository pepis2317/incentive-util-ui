"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ScrollText, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  useSidebar,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton
} from "@/components/ui/sidebar"
import { Suspense } from "react"

const items = [
  { title: "Home", href: "/", icon: Home },
  { title: "Create Invoice", href: "/create", icon: ScrollText },
  { title: "Customers", href: "/customers", icon: User },
  { title: "Items", href: "/items", icon: Package },
]

function SidebarNav() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuButton
          key={item.href}
          isActive={pathname === item.href}
          render={<Link href={item.href} />}
        >
          <item.icon />
          <span>{item.title}</span>
        </SidebarMenuButton>
      ))}
    </SidebarMenu>
  )
}

function SidebarNavFallback() {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuButton
          key={item.href}
          render={<Link href={item.href} />}
        >
          <item.icon />
          <span>{item.title}</span>
        </SidebarMenuButton>
      ))}
    </SidebarMenu>
  )
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>{/* your header */}</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={<SidebarNavFallback />}>
              <SidebarNav />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
} 
