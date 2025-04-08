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
import { deleteEvent, getEvents, getEventsByVenueId } from "@/actions/event-actions";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useVenueStore } from "@/stores/useVenuestore";
import { EventWithDetails } from "@/types/event-types";

export default function AllEventsPage() {
    const { selectedVenue } = useVenueStore();
    const [events, setEvents] = useState<EventWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        async function fetchEvents() {
            if (!selectedVenue) {
                setEvents([]);
                return;
            }

            try {
                setLoading(true);
                const data = await getEventsByVenueId(selectedVenue.id);
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, [refreshKey, selectedVenue?.id]);

    const handleDelete = async (id: number) => {
        try {
            await deleteEvent(id);
            // Trigger a refresh of the events list
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">All Events</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Event Name</TableHead>
                            <TableHead>Venue</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Created By</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            // Skeleton loader rows
                            Array(5).fill(0).map((_, index) => (
                                <TableRow key={`skeleton-${index}`}>
                                    <TableCell><Skeleton className="h-6 w-[180px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
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
                                    <TableCell>{format(new Date(event.createdAt), 'PPP', { locale: de })}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {event.createdByUser.name}
                                        </div>
                                    </TableCell>
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
                </Table>
            </div>
        </div>
    );
}
