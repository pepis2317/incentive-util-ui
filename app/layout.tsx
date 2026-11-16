import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import "./globals.css"
import { Providers } from "@/components/query-client-provider"
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="min-w-0">
            <header className="flex h-12 items-center px-4">
              <SidebarTrigger />
            </header>
            <Providers>
              <div className="p-4">{children}</div>
            </Providers>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
