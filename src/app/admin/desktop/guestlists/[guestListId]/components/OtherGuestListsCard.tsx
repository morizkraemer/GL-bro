import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EventWithDetails, GuestListWithGuests } from "@/types/event-types"
import Link from "next/link"
import { Lock, LockOpen } from "lucide-react"
import { useEffect, useState } from "react"
import { getEventGuestLists } from "@/actions/guestlist-actions"
import { Spinner } from "@/components/ui/spinner"
import { PageError } from "@/types/generic-types"
import router from "next/router"
import { logError } from "@/lib/logger"

export default function OtherGuestListCards({ event }: { event: EventWithDetails }) {
    const [lists, setLists] = useState<GuestListWithGuests[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [pageError, setPageError] = useState<PageError | null>(null)
  
    useEffect(() => {
        async function getLists() {
            try {
                setLoading(true)
                const { error, data } = await getEventGuestLists(event.id)
                if (error) {
                    if (error.code === "auth") {
                        router.push('/admin/auth/login')
                    } else {
                        setPageError({ code: "internal", message: "Something went wrong" })
                    }
                } else {
                    setLists(data)
                }
            } catch (error) {
                logError(error, "ClientError: Failed to load guest lists")
                setPageError({ code: "internal", message: "Something went wrong" })
            } finally {
                setLoading(false)
            }
        }
        getLists()
    }, [event])

    if (loading) return (
        <Card className="min-w-1/4 min-h-[33vh] flex justify-center items-center">
            <Spinner/>
        </Card>
    ) 

    if (pageError) return <div>{pageError.message}</div>

    return (
        <Card className="min-w-1/4 min-h-[33vh]">
            <CardHeader className="p-4">
                <CardTitle className="text-sm text-muted-foreground">Event Guest Lists</CardTitle>
            </CardHeader>
            <CardContent className="max-h-80 overflow-y-auto">
                {lists.length > 0 ? (
                    <div className="space-y-2">
                        {lists.map((list) => (
                            <Link
                                key={list.id}
                                href={`/admin/desktop/guestlists/${list.id}`}
                                className="block hover:bg-muted/50 rounded-md transition-colors"
                            >
                                <div className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-2">
                                        {!list.closed ? (
                                           <LockOpen className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Lock className="h-4 w-4 text-amber-500" />
                                        )}
                                        <span className="font-medium text-sm">{list.name}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">{list.guests.length} / {list.maxCapacity}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-muted-foreground">
                        No guest lists available.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
