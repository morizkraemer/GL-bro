'use client'
import { deleteGuestList, getVenueGuestLists } from "@/actions/guestlist-actions";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useVenueStore } from "@/stores/useVenuestore";
import { GuestListWithDetails } from "@/types/event-types";
import { format } from "date-fns";
import { de } from "date-fns/locale/de";
import { Ellipsis, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function() {
    const { selectedVenue } = useVenueStore();
    const [guestLists, setGuestLists] = useState<GuestListWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);


    useEffect(() => {
        const fetchGuestLists = async () => {
            try {
                setLoading(true);
                const response = await getVenueGuestLists(selectedVenue!.id);
                setGuestLists(response);
            } catch (error) {
                console.error("", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGuestLists();
    }, [selectedVenue!.id, refreshKey]);

    const handleDelete = async (id: number) => {
        try {
            await deleteGuestList(id);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Error deleting GuestList:", error);
        }
    };
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>List Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Venue</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Created At</TableHead>
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
                        guestLists.map((guestlist) => (
                            <TableRow key={guestlist.id}>
                                <TableCell className="font-medium">
                                    <Link
                                        href={`/admin/desktop/events/${guestlist.id}`}
                                        className="hover:underline text-primary"
                                    >
                                        {guestlist.name}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {guestlist.closed ? "closed" : "open"}
                                    </div>
                                </TableCell>
                                <TableCell>{guestlist.event.venue.name}</TableCell>
                                <TableCell>{format(new Date(guestlist.event.eventDate), 'PPP', { locale: de })}</TableCell>
                                <TableCell>{guestlist.maxCapacity}</TableCell>
                                <TableCell>{format(new Date(guestlist.createdAt), 'PPP', { locale: de })}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {guestlist.createdByUser.name}
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
                                                    href={`/admin/desktop/events/${guestlist.id}`}
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
                                                    onClick={() => handleDelete(guestlist.id)}
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
    )
}
