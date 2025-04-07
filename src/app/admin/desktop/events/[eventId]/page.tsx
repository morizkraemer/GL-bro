'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { getEventById } from '@/actions/event-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

type Props = {
    params: Promise<{
        eventId: string;
    }>
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
                <div className="mb-6">
                    <Skeleton className="h-8 w-24 mb-4" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-10 w-3/4 mb-2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-6 w-2/3" />
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
                    <div className="mb-6">
                        <Link href="/admin/desktop/events">
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Events
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <Link href="/">
                            <Button variant="destructive" className="flex items-center gap-2">
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>
                <Card className="bg-destructive/10">
                    <CardContent className="pt-6">
                        <p className="text-center text-destructive">{error}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 max-w-3xl">
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

            <Card className="overflow-hidden">
                <CardHeader className="pb-0">
                    <CardTitle className="text-2xl font-bold">{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.eventDate), 'PPP, HH:mm', { locale: de })}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue.name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Capacity: {event.venue.capacity}</span>
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
