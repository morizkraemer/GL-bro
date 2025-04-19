'use client'

import { getGuestListById } from "@/actions/guestlist-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EventWithDetails, GuestListWithDetails } from "@/types/event-types";
import { format } from "date-fns";
import { de } from "date-fns/locale/de";
import { ArrowLeft, Calendar, CheckCircle, CheckSquare, CircleX, MapPin, MinusSquare, UserIcon, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEventById } from "@/actions/event-actions";
import CopyInput from "@/components/ui/input-clipboard";
import { Checkbox } from "@/components/ui/checkbox";
import NumberDropdown from "@/components/ui/custom/number-dropdown";

export default function GuestListDetailsPage() {
    const params = useParams();
    const [guestList, setGuestList] = useState<GuestListWithDetails | null>(null);
    const [event, setEvent] = useState<EventWithDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuestList = async () => {
            try {
                setLoading(true);
                const id = parseInt(params.guestListId as string);
                if (isNaN(id)) {
                    throw new Error("Invalid guest list ID");
                }
                const guestListResponse = await getGuestListById(id);
                const eventResponse = await getEventById(guestListResponse.eventId);
                setEvent(eventResponse);
                setGuestList(guestListResponse);
            } catch (error) {
                console.error("Error fetching guest list:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGuestList();
    }, [params.guestListId]);

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
    const capacityPercentage = guestList.maxCapacity
        ? Math.min(100, Math.round((guestCount / guestList.maxCapacity) * 100))
        : 0;

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
                        <div className="flex items-center gap-x-4">
                            <CardTitle>List Details</CardTitle>
                            <div className={`px-2 py-1 text-xs rounded-full ${guestList.closed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {guestList.closed ? 'Closed' : 'Open'}
                            </div>
                        </div>
                        <CardDescription>Information about the Guestlist</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Date:</span>
                                <span>{format(new Date(guestList.event.eventDate), 'PPP', { locale: de })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Venue:</span>
                                <span>{guestList.event.venue.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Capacity:</span>
                                <span>
                                    {guestCount} / {guestList.maxCapacity || 'Unlimited'}
                                    {guestList.maxCapacity && (
                                        <span className="ml-2">({capacityPercentage}%)</span>
                                    )}
                                </span>
                                {guestList.maxCapacity && (
                                    <div className="w-32 h-2 bg-gray-200 rounded-full ml-2">
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${capacityPercentage}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Created by:</span>
                                <span>{guestList.createdByUser.name}</span>
                                <span className="text-sm text-muted-foreground ml-2">
                                    on {format(new Date(guestList.createdAt), 'PPP', { locale: de })}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="min-w-1/4">
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm text-muted-foreground">Event Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {event ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{event.name}</span>
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
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-sm">Available Guest Lists:</span>
                                    <div className="rounded-md border-[1px] p-2 mt-1">
                                        {event.guestLists.map((list) => (
                                            <Link
                                                key={list.id}
                                                href={`/admin/desktop/guestlists/${list.id}`}
                                                className="block hover:bg-gray-900 rounded-md"
                                            >
                                                <div className="flex items-center justify-between p-1 border-b last:border-b-0">
                                                    <span className="font-medium text-sm flex-1">{list.name}</span>
                                                    <span className="text-xs px-1 py-1 rounded-full flex-none">
                                                        {list.closed ? 'Closed' : 'Open'}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground">
                                Event details are not available.
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">
                            View Event
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="flex justify-between gap-x-4">
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Editors</CardTitle>
                    </CardHeader>
                    <CardContent>
                    </CardContent>
                    <CardFooter>
                        <Button variant="default">Add new</Button>
                    </CardFooter>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>One Time Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {true ? (
                            <div>no links yet</div>
                        )
                            :
                            (
                                <Table>
                                </Table>

                            )
                        }

                    </CardContent>
                    <CardFooter className="block">
                        <div className="flex gap-x-4 justify-between items-center p-2 px-4 border rounded-lg ">
                            <Button variant="default">Create New</Button>
                            <NumberDropdown size={15} placeholder="Select Slots" prefix="Slots" />
                            <div className="border border-input rounded-md p-2">
                                <Checkbox id="plusone" />
                                <label htmlFor="plusone" className="pl-1">+1</label>
                            </div>


                            <CopyInput className="flex-1" value="link" />
                        </div>
                    </CardFooter>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Guests ({guestCount})</CardTitle>
                </CardHeader>
                <CardContent>
                    {guestList.guests.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                            No guests have been added to this list yet.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Name</TableHead>
                                        <TableHead>Plus one</TableHead>
                                    <TableHead>Confirmed</TableHead>
                                    <TableHead>Added On</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {guestList.guests.map((guest) => (
                                    <TableRow key={guest.id} className="hover:bg-gray-900">
                                        <TableCell className="font-medium">{guest.name}</TableCell>
                                        <TableCell>{guest.plusOne ? <CheckCircle /> : <CircleX />}</TableCell>
                                        <TableCell>{guest.confirmed ? <CheckSquare /> :
                                            <div className="flex items-center gap-x-2">
                                                <MinusSquare />
                                                <Button variant="destructive">Confirm</Button>
                                            </div>}</TableCell>
                                        <TableCell>{format(new Date(guest.createdAt), 'PPP', { locale: de })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                <CardFooter>
                    <Button>Add Guest</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
