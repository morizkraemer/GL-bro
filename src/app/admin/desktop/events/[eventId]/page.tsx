'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { ArrowLeft, Calendar, Clock, Lock, LockOpen, MapPin, Users, Info } from 'lucide-react'
import Link from 'next/link'
import { getEventById } from '@/actions/event-actions'
import { toggleGuestListClosed } from '@/actions/guestlist-actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import React from 'react'
import { EventWithDetails } from '@/types/event-types'
import { PageError } from '@/types/generic-types'
import router from 'next/router'

type Props = {
    params: Promise<{
        eventId: string;
    }>
}

export default function EventDetailsPage({ params }: Props) {
    const { eventId } = React.use(params)
    const [event, setEvent] = useState<EventWithDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<PageError | null>(null)
    const [isClosingAll, setIsClosingAll] = useState(false)

    const handleToggleClose = async (id: number, closed: boolean) => {
        try {
            await toggleGuestListClosed(id, closed);
            const {error, data} = await getEventById(parseInt(eventId));
            if (error) {
                if (error.code === "auth") return router.push('/admin/auth/login')
                setError(error);
                return;
            }
            setEvent(data);
        } catch (error) {
            console.error("Error toggling guestlist status:", error);
            setError({code: "generic", message: "Failed to update guest list status"});
        }
    };

    const handleCloseAll = async () => {
        setIsClosingAll(true);
        try {
            if (!event) return;
            for (const guestList of event.guestLists) {
                if (!guestList.closed) {
                    await handleToggleClose(guestList.id, true);
                }
            }
        } finally {
            setIsClosingAll(false);
        }
    };

    useEffect(() => {
        async function fetchEvent() {
            try {
                setLoading(true)
                const {error, data} = await getEventById(parseInt(eventId))
                if (error) {

                    setError(error)
                    return
                }
                setEvent(data)
            } catch (err) {
                console.error('Error fetching event:', err)
                setError({code: "generic", "message" : 'Failed to load event'})
            } finally {
                setLoading(false)
            }
        }

        fetchEvent()
    }, [eventId])

    if (loading) {
        return (
            <div className="container mx-auto py-8 max-w-4xl">
                <div className='flex justify-between items-center mb-6'>
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-24" />
                </div>
                <Card className="overflow-hidden shadow-md border-t-4 border-t-primary">
                    <CardHeader className="pb-2 bg-muted/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <Skeleton className="h-10 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-6 w-20" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="bg-background shadow-sm">
                                <CardContent className="p-4 flex flex-col items-center justify-center">
                                    <Skeleton className="h-10 w-10 rounded-full mb-2" />
                                    <Skeleton className="h-4 w-16 mb-1" />
                                    <Skeleton className="h-5 w-32" />
                                </CardContent>
                            </Card>
                            <Card className="bg-background shadow-sm">
                                <CardContent className="p-4 flex flex-col items-center justify-center">
                                    <Skeleton className="h-10 w-10 rounded-full mb-2" />
                                    <Skeleton className="h-4 w-16 mb-1" />
                                    <Skeleton className="h-5 w-32" />
                                </CardContent>
                            </Card>
                            <Card className="bg-background shadow-sm">
                                <CardContent className="p-4 flex flex-col items-center justify-center">
                                    <Skeleton className="h-10 w-10 rounded-full mb-2" />
                                    <Skeleton className="h-4 w-16 mb-1" />
                                    <Skeleton className="h-5 w-32" />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                        <div className="grid gap-3">
                            {Array(3).fill(0).map((_, index) => (
                                <Card key={index} className="bg-card shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-6 w-16" />
                                                <Skeleton className="h-5 w-32" />
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-2 w-24 rounded-full" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-8 pt-4 border-t border-border">
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }


    if (error) {
        return (
            <div className="container mx-auto py-8 max-w-3xl">
                <div className='flex justify-between items-center'>
                    <div>
                        <Link href="/admin/desktop/events">
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Events
                            </Button>
                        </Link>
                    </div>
                </div>
                <Card className="bg-destructive/10 shadow-md mt-6">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center gap-2 text-destructive">
                            <Info className="h-5 w-5" />
                            <p className="font-medium">{error.message}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    //does not finding an event always throw an error? otherwise dont need event this
    if (!event) {
        return (
            <div className="container mx-auto py-8 max-w-3xl">
                <div className='flex justify-between items-center'>
                    <div>
                        <Link href="/admin/desktop/events">
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Events
                            </Button>
                        </Link>
                    </div>
                </div>
                <Card className="bg-destructive/10 shadow-md mt-6">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center gap-2 text-destructive">
                            <Info className="h-5 w-5" />
                            <p className="font-medium">Event not found</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const eventDate = new Date(event.eventDate)
    const formattedDate = format(eventDate, 'PPP', { locale: de })
    const formattedTime = format(eventDate, 'HH:mm', { locale: de })

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className='flex justify-between items-center mb-6'>
                <div>
                    <Link href="/admin/desktop/events">
                        <Button variant="outline" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Events
                        </Button>
                    </Link>
                </div>
                <div>
                    <Link href={`/admin/desktop/events/${eventId}/edit`}>
                        <Button variant="default" className="flex items-center gap-2">
                            Edit
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="overflow-hidden shadow-md border-t-4 border-t-primary">
                <CardHeader className="pb-2 bg-muted/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-3xl font-bold">{event.name}</CardTitle>
                            <CardDescription className="text-sm mt-1">
                                Event ID: {event.id}
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs font-normal px-3 py-1 rounded-full">
                            Active
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="bg-background shadow-sm">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="rounded-full bg-primary/10 p-2 mb-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-sm text-muted-foreground">Date</p>
                                <p className="font-medium">{formattedDate}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-background shadow-sm">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="rounded-full bg-primary/10 p-2 mb-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-sm text-muted-foreground">Time</p>
                                <p className="font-medium">{formattedTime}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-background shadow-sm">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="rounded-full bg-primary/10 p-2 mb-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-sm text-muted-foreground">Venue</p>
                                <p className="font-medium">{event.venue.name}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        {event.guestLists.length > 0 ? (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold">Guest Lists</h3>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm" disabled={isClosingAll}>
                                                {isClosingAll ? 'Closing...' : 'Close All Lists'}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Close All Guest Lists</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to close all guest lists for this event? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleCloseAll}>Close All</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                <div className="grid gap-3">
                                    {event.guestLists.map((list) => (
                                        <Card key={list.id} className="bg-card shadow-sm">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-5 w-5 text-muted-foreground" />
                                                        <Link href={`/admin/desktop/guestlists/${list.id}`}><span className="font-medium hover:underline">{list.name}</span></Link>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm text-muted-foreground">
                                                            {list.guests.length} guests
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleToggleClose(list.id, !list.closed)}
                                                            className="flex items-center gap-2"
                                                        >
                                                            {list.closed ? (
                                                                <>
                                                                    <Lock className="h-4 w-4" />
                                                                    Closed
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <LockOpen className="h-4 w-4" />
                                                                    Open
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No guest lists created yet
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
