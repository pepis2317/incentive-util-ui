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

const items = [
  { title: "Home", href: "/", icon: Home },
  { title: "Invoices", href: "/invoices", icon: ScrollText },
  { title: "Customers", href: "/customers", icon: User },
  { title: "Items", href: "/items", icon: Package },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader>Incentive Util</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuButton
                  onClick={() => setOpenMobile(false)}
                  key={item.href}
                  isActive={pathname === item.href}
                  render={<Link href={item.href} />}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}


