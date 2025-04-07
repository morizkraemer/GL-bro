'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { ArrowLeft, Calendar, Clock, Lock, LockOpen, MapPin, Users, Info } from 'lucide-react'
import Link from 'next/link'
import { getEventById } from '@/actions/event-actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import React from 'react'

type Props = {
    params: Promise<{
        eventId: string;
    }>
}

// GuestList interface for proper type checking
interface GuestList {
    id: number;
    name: string;
    guests: any[];
    maxCapacity: number;
    closed: boolean;
}

export default function EventDetailsPage({ params }: Props) {
    const { eventId } = React.use(params)
    const [event, setEvent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchEvent() {
            try {
                setLoading(true)
                const eventData = await getEventById(parseInt(eventId))
                console.log('Event data:', eventData)
                setEvent(eventData)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load event')
                console.error('Error fetching event:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchEvent()
    }, [eventId])

    if (loading) {
        return (
            <div className="container mx-auto py-8 max-w-3xl">
                <div className="mb-6 flex items-center">
                    <Skeleton className="h-10 w-32 mr-2" />
                    <Skeleton className="h-6 w-64 ml-auto" />
                </div>
                <Card className="shadow-md">
                    <CardHeader>
                        <Skeleton className="h-10 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-between">
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-6 w-1/4" />
                        </div>
                        <Skeleton className="h-4 w-full mt-4" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-6 w-1/3" />
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
                            <p className="font-medium">{error}</p>
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
                            {event.status || 'Active'}
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
                        {
                            event.guestLists.length > 0 ? (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Guest Lists</h3>
                                    <div className="grid gap-3">
                                        {event.guestLists.map((guestList: any) => (
                                            <Card key={guestList.id} className="bg-card shadow-sm">
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            {!guestList.closed 
                                                                ? <LockOpen className="h-4 w-4 text-green-500" /> 
                                                                : <Lock className="h-4 w-4 text-amber-500" />
                                                            }
                                                            <span className="font-medium">{guestList.name}</span>
                                                            <Badge variant="outline" className={`ml-2 ${!guestList.closed ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                                                {!guestList.closed ? 'Open' : 'Closed'}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-sm">
                                                                <span className="font-medium">{guestList.guests.length}</span>
                                                                <span className="text-muted-foreground"> / {guestList.maxCapacity} guests</span>
                                                            </div>
                                                            <div className="w-24 bg-muted h-2 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full rounded-full ${guestList.guests.length >= guestList.maxCapacity ? 'bg-destructive' : 'bg-primary'}`}
                                                                    style={{ width: `${Math.min(100, (guestList.guests.length / guestList.maxCapacity) * 100)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-muted/30 rounded-lg">
                                    <p className="text-muted-foreground">No guest lists available for this event.</p>
                                </div>
                            )
                        }
                    </div>

                    <div className="mt-8 pt-4 border-t border-border">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                        <p>{format(new Date(event.createdAt), 'PPP', { locale: de })}</p>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
