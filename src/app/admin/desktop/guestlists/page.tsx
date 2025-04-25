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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import CapacityComponent from "@/components/ui/pieces/capacity";
import router from 'next/router'
import { PageError } from "@/types/generic-types";
import { logError } from "@/lib/logger";
import { toast } from "sonner";

export default function() {
    const { selectedVenue } = useVenueStore();
    const [guestLists, setGuestLists] = useState<GuestListWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [pageError, setPageError] = useState<PageError | null>(null)

    if (!selectedVenue) return setPageError({ code: "generic", message: "Select a venue" })


    useEffect(() => {
        const fetchGuestLists = async () => {
            try {
                setLoading(true);
                const { error, data } = await getVenueGuestLists(selectedVenue!.id);
                if (error) {
                    if (error.code === "auth") {
                        return router.push('/admin/auth/login')
                    } else {
                        return setPageError(error)
                    }
                }
                setGuestLists(data);
            } catch (error) {
                logError(error, "clientError all guestlists")
                setPageError({ code: "generic", message: "Something went wrong" })
            } finally {
                setLoading(false);
            }
        };

        fetchGuestLists();
    }, [selectedVenue!.id, refreshKey]);

    const handleDelete = async (id: number) => {
        try {
            const { error } = await deleteGuestList(id);
            if (error) {
                if (error.code === "auth") {
                    return router.push('/admin/auth/login')
                } else {
                    toast.error(error.message)
                }
            }
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            logError(error, "Error deleting GuestList:");
            setPageError({ code: "generic", message: "Something went wrong" })
        }
    };

    const handleToggleClose = async (id: number, closed: boolean) => {
        try {
            const { error } = await toggleGuestListClosed(id, closed);
            if (error) {
                if (error.code === "auth") {
                    return router.push('/admin/auth/login')
                } else {
                    toast.error(error.message)
                }
            }
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            logError(error, "Error closing GuestList");
            setPageError({ code: "generic", message: "Something went wrong" })
        }
    }

    if (pageError) return <div>{pageError.message}</div>

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">All Guestlists</h1>
            <div className="rounded-md border">
                <Table className="w-full text-sm">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[5%]">Status</TableHead>
                            <TableHead className="w-[15%]">List Name</TableHead>
                            <TableHead className="w-[20%]">Capacity</TableHead>
                            <TableHead className="w-[10%]">Event</TableHead>
                            <TableHead className="w-[10%]">Date</TableHead>
                            <TableHead className="w-[5%] text-center">Created By</TableHead>
                            <TableHead className="w-[5%] text-center">Created At</TableHead>
                            <TableHead className="w-[5%]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array(5).fill(0).map((_, index) => (
                                <TableRow key={`skeleton-${index}`} className="hover:bg-gray-100">
                                    <TableCell><Skeleton className="h-6 w-[600px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[300px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[550px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[300px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[250px]" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-6 w-[100px]" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-6 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            guestLists.map((guestlist) => (
                                <TableRow key={guestlist.id} className="hover:bg-gray-900">
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            className={`px-2 py-1 text-xs rounded-full w-fit ${guestlist.closed ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                                            onClick={() => handleToggleClose(guestlist.id, !guestlist.closed)}
                                        >
                                            {guestlist.closed ? 'Closed' : 'Open'}
                                        </Button>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <Link
                                            href={`/admin/desktop/guestlists/${guestlist.id}`}
                                            className="hover:underline text-primary"
                                        >
                                            {guestlist.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell><CapacityComponent guestList={guestlist} long /></TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/admin/desktop/events/${guestlist.event.id}`}
                                            className="hover:underline text-primary"
                                        >
                                            {guestlist.event.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{format(new Date(guestlist.event.eventDate), 'P', { locale: de })}</TableCell>
                                    <TableCell className="text-center">
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <div className="flex items-center justify-center cursor-pointer">
                                                    <Avatar className="h-8 w-8 bg-green-500">
                                                        <AvatarImage src={undefined} />
                                                        <AvatarFallback>{guestlist.createdByUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-80">
                                                <div className="flex justify-between space-x-4">
                                                    <Avatar className="h-10 w-10 bg-green-500">
                                                        <AvatarImage src={undefined} />
                                                        <AvatarFallback>{guestlist.createdByUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1">
                                                        <h4 className="text-sm font-semibold">{guestlist.createdByUser.name}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {guestlist.createdByUser.email}
                                                        </p>
                                                        <div className="flex items-center pt-2">
                                                            <span className="text-xs text-muted-foreground">
                                                                Created on {format(new Date(guestlist.createdAt), 'P', { locale: de })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
                                    </TableCell>
                                    <TableCell className="text-center">{format(new Date(guestlist.createdAt), 'P', { locale: de })}</TableCell>
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
