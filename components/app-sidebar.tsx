"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ScrollText, Truck, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
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
  { title: "Sell In", href: "/sell-in", icon: Truck },
  { title: "Customers", href: "/customers", icon: User },
  { title: "Items", href: "/items", icon: Package },
]

function SidebarNav() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuButton
          size="lg"
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
          size="lg"
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
