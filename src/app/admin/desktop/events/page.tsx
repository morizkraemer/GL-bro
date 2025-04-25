'use client'
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Ellipsis, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { deleteEvent, getEventsByVenueId } from "@/actions/event-actions";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useVenueStore } from "@/stores/useVenuestore";
import { EventWithDetails } from "@/types/event-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { toast } from "sonner";
import { PageError } from "@/types/generic-types";
import router from "next/router";
import { logError } from "@/lib/logger";

export default function AllEventsPage() {
    const { selectedVenue } = useVenueStore();
    const [events, setEvents] = useState<EventWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<PageError | null>(null)
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        async function fetchEvents() {
            if (!selectedVenue) {
                setEvents([]);
                setLoading(false)
                return;
            }

            setLoading(true)
            const { error, data } = await getEventsByVenueId(selectedVenue.id);
            if (error) {
                if (error.code === "auth") {
                    router.push('/admin/auth/login')
                } else if (error.code === "missingResource") {
                    setEvents([]);
                    setLoading(false)
                } else {
                    setError(error)
                }
            } else {
                setEvents(data);
                setLoading(false)
            }
        }

        fetchEvents();
    }, [refreshKey, selectedVenue?.id]);

    const handleDelete = async (id: number) => {
        try {
            const { error } = await deleteEvent(id);
            if (error) {
                toast.error(error.message)
                return
            }
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            logError(error, "client error deleting event")
            toast.error("Error deleting event");
        }
    };

    if (error) return <div>{error.message}</div>

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">All Events</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[600px]">Event Name</TableHead>
                            <TableHead className="w-[300px]">Venue</TableHead>
                            <TableHead className="w-[300px]">Date</TableHead>
                            <TableHead className="w-[100px] text-center">Created By</TableHead>
                            <TableHead className="w-[100px] text-center">Created At</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    {
                        events.length > 0 ?
                            <TableBody>
                                {loading ? (
                                    // Skeleton loader rows
                                    Array(5).fill(0).map((_, index) => (
                                        <TableRow key={`skeleton-${index}`}>
                                            <TableCell><Skeleton className="h-6 w-[600px]" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-[300px]" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-[300px]" /></TableCell>
                                            <TableCell className="text-center"><Skeleton className="h-6 w-[100px]" /></TableCell>
                                            <TableCell className="text-center"><Skeleton className="h-6 w-[100px]" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    events.map((event) => (
                                        <TableRow key={event.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={`/admin/desktop/events/${event.id}`}
                                                    className="hover:underline text-primary"
                                                >
                                                    {event.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{event.venue.name}</TableCell>
                                            <TableCell>{format(new Date(event.eventDate), 'PPP', { locale: de })}</TableCell>
                                            <TableCell className="text-center">
                                                <HoverCard>
                                                    <HoverCardTrigger asChild>
                                                        <div className="flex items-center justify-center cursor-pointer">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={undefined} />
                                                                <AvatarFallback>{event.createdByUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                            </Avatar>
                                                        </div>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className="w-80">
                                                        <div className="flex justify-between space-x-4">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage src={undefined} />
                                                                <AvatarFallback>{event.createdByUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="space-y-1">
                                                                <h4 className="text-sm font-semibold">{event.createdByUser.name}</h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Created this event
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </TableCell>
                                            <TableCell className="text-center">{format(new Date(event.createdAt), 'PPP', { locale: de })}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Ellipsis className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Link
                                                                href={`/admin/desktop/events/${event.id}`}
                                                                className="w-full"
                                                            >
                                                                <Button variant="ghost" className="w-full text-left flex items-center gap-2">
                                                                    <Eye className="h-4 w-4" />
                                                                    View
                                                                </Button>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Button variant="ghost" className="w-full text-left">
                                                                Edit
                                                            </Button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Button
                                                                variant="ghost"
                                                                className="w-full text-left text-red-400"
                                                                onClick={() => handleDelete(event.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                            :
                            <TableBody className=""><TableRow className=""><TableCell className="h-24 text-center text-gray-400" colSpan={6}>No events for selected venue</TableCell></TableRow></TableBody>
                    }
                </Table>
            </div>
        </div>
    );
}
