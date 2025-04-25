import { ReactNode } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import AuthProvider from './ClientWrapper';


export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>

                <SidebarProvider>
                    <div className=''>
                        <Sidebar />
                    </div>
                    <div className="flex min-h-screen w-full">
                        <main className="flex-1 p-4">
                            {children}
                        </main>
                    </div>
                </SidebarProvider>
        </AuthProvider>
    )
}
