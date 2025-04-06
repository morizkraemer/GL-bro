import { ReactNode } from 'react'
import Sidebar from '@/components/sidebar/Sidebar' // your sidebar component
import { SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider >
            <div className=''>
                <Sidebar />
            </div>
            <div className="flex min-h-screen w-full">
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
