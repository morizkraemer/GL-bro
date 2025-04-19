'use client'

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Key, Lock, LockOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getEventsByUserId } from "@/actions/event-actions";
import { EventWithVenue, GuestListWithGuests } from "@/types/event-types";
import { getGuestListsByUserId } from "@/actions/guestlist-actions";

export default function ProfilePage() {
    const { data: session } = useSession();
    const [events, setEvents] = useState<EventWithVenue[]>([]);
    const [guestlists, setGuestlists] = useState<GuestListWithGuests[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            if (!session?.user?.id) return;
            try {
                const eventData = await getEventsByUserId(session.user.id);
                const guestlistData = await getGuestListsByUserId(session.user.id)
                setEvents(eventData);
                setGuestlists(guestlistData);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, [session?.user?.id]);

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Card */}
                <Card className="w-full md:w-1/3 h-fit">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={session?.user?.image || ""} />
                                <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold">{session?.user?.name}</h2>
                                <p className="text-muted-foreground">{session?.user?.email}</p>
                                {/*<Badge variant="outline" className="mt-2">
                                    {session?.user?.role || "User"}
                                </Badge>*/}
                            </div>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/admin/desktop/profile/account-settings">
                                    Edit Profile
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Content Tabs */}
                <div className="w-full md:w-2/3">
                    <Tabs defaultValue="events" className="w-full">
                        <Card>
                            <div className="grid grid-cols-3">
                                <div className="col-span-3">
                                    <TabsList className="w-full inline-flex h-9 items-center justify-center rounded-t-lg bg-background p-1">
                                        <TabsTrigger value="events" className="inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-900 data-[state=active]:text-foreground data-[state=active]:shadow">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Events
                                        </TabsTrigger>
                                        <TabsTrigger value="guestlists" className="inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-900 data-[state=active]:text-foreground data-[state=active]:shadow">
                                            <Users className="h-4 w-4 mr-2" />
                                            Guest Lists
                                        </TabsTrigger>
                                        <TabsTrigger value="accesscodes" className="inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-900 data-[state=active]:text-foreground data-[state=active]:shadow">
                                            <Key className="h-4 w-4 mr-2" />
                                            Access Codes
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                            </div>

                            <TabsContent value="events" className="pt-4">
                                <CardContent>
                                    {loading ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                                            ))}
                                        </div>
                                    ) : events.length > 0 ? (
                                        <div className="space-y-4">
                                            {events.map((event) => (
                                                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div>
                                                        <h3 className="font-medium">{event.name}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(event.eventDate).toLocaleDateString()} at {event.venue.name}
                                                        </p>
                                                    </div>
                                                    <Button variant="ghost" asChild>
                                                        <Link href={`/admin/desktop/events/${event.id}`}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-muted-foreground py-4">No events found</p>
                                    )}
                                </CardContent>
                            </TabsContent>

                            <TabsContent value="guestlists">
                                <CardContent>
                                    {loading ? (
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-18 bg-muted animate-pulse rounded-lg" />
                                            ))}
                                        </div>
                                    ) : guestlists.length > 0 ? (
                                        <div className="space-y-2.5">
                                            {guestlists.map(guestList => (
                                                <div key={guestList.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div className="flex flex-grow items-center gap-2 min-w-0">
                                                        {!guestList.closed
                                                            ? <LockOpen className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                            : <Lock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                                                        }
                                                        <div className="min-w-0">
                                                            <h3 className="font-medium truncate text-sm">{guestList.name}</h3>
                                                            <p className="text-sm text-muted-foreground truncate">
                                                                {guestList.event.name} - {guestList.event.eventDate.toDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="px-2 flex-shrink-0 text-sm">
                                                        {guestList.guests.length}/{guestList.maxCapacity} guests
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-muted-foreground py-3 text-sm">No guest lists found</p>
                                    )}
                                </CardContent>
                            </TabsContent>

                            <TabsContent value="accesscodes">
                                <CardContent>
                                    <p className="text-center text-muted-foreground py-3 text-sm">
                                        Access code management coming soon...
                                    </p>
                                </CardContent>
                            </TabsContent>
                        </Card>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
