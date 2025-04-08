'use client';
import { Settings, Calendar, CalendarPlus } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSubItem } from "../ui/sidebar";
import { Button } from "../ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import UserButton from "./sidebar-components/UserButton";
import VenueDropdown from "./sidebar-components/VenueDropdown";
import { Venue } from "@/types/event-types";

export default function SidebarDesktop({ venues }: { venues: Venue[] }) {
    const router = useRouter();

    return (
        <Sidebar className="border-r shadow-sm">
            <SidebarHeader className="py-4">
                    <VenueDropdown venues={venues} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-slate-500 px-3 py-2">
                        Events
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => router.push("/admin/desktop/events")}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium transition-all hover:bg-slate-100 rounded-md"
                                >
                                    <Calendar className="h-4 w-4" />
                                    All Events
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => router.push("/admin/desktop/events/create")}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium transition-all hover:bg-slate-100 rounded-md"
                                >
                                    <CalendarPlus className="h-4 w-4" />
                                    Create Event
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => router.push("/admin/desktop/guestlists")}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium transition-all hover:bg-slate-100 rounded-md"
                                >
                                    <CalendarPlus className="h-4 w-4" />
                                    All Guestlists
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter >
                <div className="flex justify-between w-full">
                    <UserButton />
                    <Button variant="ghost" className="justify-start">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>

            </SidebarFooter>
        </Sidebar>
    );
};




