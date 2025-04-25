'use client'

import { getGuestListById } from "@/actions/guestlist-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EventWithDetails, GuestListWithDetails } from "@/types/event-types";
import { format } from "date-fns";
import { de } from "date-fns/locale/de";
import { ArrowLeft, Calendar, MapPin, UserIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEventById } from "@/actions/event-actions";
import OneTimeLinksCard from "./components/OneTimeLinksCard";
import EditorsCard from "./components/EditorsCard";
import GuestsCard from "./components/GuestsCard";
import CapacityComponent from "@/components/ui/pieces/capacity";
import OtherGuestListCards from "./components/OtherGuestListsCard";
import { PageError } from "@/types/generic-types";
import router from "next/router"
import { logError } from "@/lib/logger";
import page from "../page";

export default function GuestListDetailsPage() {
    const params = useParams();
    const [guestList, setGuestList] = useState<GuestListWithDetails | null>(null);
    const [event, setEvent] = useState<EventWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState<PageError | null>(null)

    useEffect(() => {
        const fetchGuestList = async () => {
            try {
                setLoading(true);
                const id = parseInt(params.guestListId as string);
                if (isNaN(id)) {
                    setPageError({code: "generic", message: "Not a valid guestlist"})
                }
                const { error: guestListError, data: guestListData } = await getGuestListById(id);
                if (guestListError) {
                    if (guestListError.code === "auth") {
                        router.push('/admin/auth/signup');
                        return;
                    } else {
                        setPageError(guestListError);
                        return
                    }
                }

                const { error: eventError, data: eventData } = await getEventById(guestListData.eventId);
                if (eventError) {
                    setPageError(eventError)
                    return
                }
                setEvent(eventData);
                setGuestList(guestListData);
                setLoading(false)
            } catch (error) {
                logError(error, "Client Error fetching guestlist");
            } finally {
                setLoading(false);
            }
        };

        fetchGuestList();
    }, [params.guestListId]);

    if (pageError) return <div>{pageError.message}</div>


    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-[300px]" />
                    <Skeleton className="h-10 w-[100px]" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-[250px]" />
                        <Skeleton className="h-6 w-[300px]" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-[350px]" />
                            <Skeleton className="h-6 w-[400px]" />
                            <Skeleton className="h-6 w-[300px]" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-[200px]" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array(5).fill(0).map((_, index) => (
                                <Skeleton key={`skeleton-${index}`} className="h-10 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-[200px]" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-[150px]" />
                            <Skeleton className="h-6 w-[200px]" />
                            <Skeleton className="h-6 w-[150px]" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!guestList) {
        return (
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold mb-4">Guest List Not Found</h1>
                <p className="mb-4">The requested guest list could not be found.</p>
                <Link href="/admin/desktop/guestlists">
                    <Button>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Guest Lists
                    </Button>
                </Link>
            </div>
        );
    }

    const guestCount = guestList.guests.length;

    if (!event) {
        return (
            <Card className="min-w-1/4">
                <CardHeader className="p-4">
                    <CardTitle className="text-sm text-muted-foreground">Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-6 text-muted-foreground">
                        Event details are not available.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Link href="/admin/desktop/guestlists">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{guestList.name}</h1>
                </div>
                <Button variant="outline">
                    Edit Guest List
                </Button>
            </div>

            <div className="flex justify-between gap-x-4">
                <Card className="grow-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-4">
                                <CardTitle>List Details</CardTitle>
                                <div className={`px-2 py-1 text-xs rounded-full ${guestList.closed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {guestList.closed ? 'Closed' : 'Open'}
                                </div>
                            </div>
                            <CapacityComponent guestList={guestList} long={true} />
                        </div>
                        <CardDescription>Information about the Guestlist</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Created by:</span>
                                    <span>{guestList.createdByUser.name}</span>
                                    <span className="text-sm text-muted-foreground ml-2">
                                        on {format(new Date(guestList.createdAt), 'PPP', { locale: de })}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-lg">{event.name}</span>
                                    <Link href={`/admin/desktop/events/${event.id}`}>
                                        <Button variant="outline" size="sm">
                                            View Event
                                        </Button>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Date:</span>
                                    <span>{format(new Date(event.eventDate), 'PPP', { locale: de })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Venue:</span>
                                    <span>{event.venue.name}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <OtherGuestListCards event={event} />
            </div>

            <div className="flex justify-between gap-x-4">
                <EditorsCard />
                <OneTimeLinksCard guestlist={guestList} />
            </div>

            <GuestsCard guestList={guestList} guestCount={guestCount} />
        </div>
    );
}
