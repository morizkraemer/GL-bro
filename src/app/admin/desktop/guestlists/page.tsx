'use client'
import { deleteGuestList, getVenueGuestLists, toggleGuestListClosed } from "@/actions/guestlist-actions";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useVenueStore } from "@/stores/useVenuestore";
import { GuestListWithDetails } from "@/types/event-types";
import { format } from "date-fns";
import { de } from "date-fns/locale/de";
import { Edit, Ellipsis, Eye, Lock, LockOpenIcon } from "lucide-react";
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

    const handleToggleClose = async (id: number, closed: boolean) => {
        try {
            await toggleGuestListClosed(id, closed);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Error closing GuestList:", error);
        }
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">All Guestlists</h1>
            <div className="rounded-md border">
                <Table className="w-full text-sm">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-medium text-left">List Name</TableHead>
                            <TableHead className="font-medium text-left">Status</TableHead>
                            <TableHead className="font-medium text-left">Venue</TableHead>
                            <TableHead className="font-medium text-left">Date</TableHead>
                            <TableHead className="font-medium text-left">Capacity</TableHead>
                            <TableHead className="font-medium text-left">Created By</TableHead>
                            <TableHead className="font-medium text-left">Created At</TableHead>
                            <TableHead className="w-[80px] text-left"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array(5).fill(0).map((_, index) => (
                                <TableRow key={`skeleton-${index}`} className="hover:bg-gray-100">
                                    <TableCell><Skeleton className="h-6 w-[180px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            guestLists.map((guestlist) => (
                                <TableRow key={guestlist.id} className="hover:bg-gray-900">
                                    <TableCell className="font-medium">
                                        <Link
                                            href={`/admin/desktop/guestlists/${guestlist.id}`}
                                            className="hover:underline text-primary"
                                        >
                                            {guestlist.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <div className={`px-2 py-1 text-xs rounded-full w-fit ${guestlist.closed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {guestlist.closed ? 'Closed' : 'Open'}
                                        </div>
                                    </TableCell>
                                    <TableCell>{guestlist.event.venue.name}</TableCell>
                                    <TableCell>{format(new Date(guestlist.event.eventDate), 'PPP', { locale: de })}</TableCell>
                                    <TableCell>{guestlist.maxCapacity}</TableCell>
                                    <TableCell>{guestlist.createdByUser.name}</TableCell>
                                    <TableCell>{format(new Date(guestlist.createdAt), 'PPP', { locale: de })}</TableCell>
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
                                                        href={`/admin/desktop/guestlists/${guestlist.id}`}
                                                        className="w-full"
                                                    >
                                                        <Button variant="ghost" className="w-full text-left flex items-center gap-2">
                                                            <Eye className="h-4 w-4" />
                                                            View
                                                        </Button>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link href={`/admin/desktop/guestlists/${guestlist.id}/edit`} className="w-full">
                                                        <Button variant="ghost" className="w-full text-left">
                                                            <Edit className="h-4 w-4" />
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    {guestlist.closed ?
                                                        <Button variant="ghost" className="w-full text-left" onClick={() => handleToggleClose(guestlist.id, false)}>
                                                            <LockOpenIcon className="h-4 w-4" />
                                                            Open
                                                        </Button>
                                                        :
                                                        <Button variant="ghost" className="w-full text-left" onClick={() => handleToggleClose(guestlist.id, true)}>
                                                            <Lock className="h-4 w-4" />
                                                            Close
                                                        </Button>
                                                    }

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
        </div>
    )
}
