'use client';
import { Plus } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSubItem } from "../ui/sidebar";
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Venue } from "@prisma/client";
import { Button } from "../ui/button";
import React from "react";
import { useVenueStore } from "@/stores/useVenuestore";
import { useRouter } from "next/navigation";

export default function({ venues }: { venues: Venue[] }) {
    const {selectedVenue, setSelectedVenue} = useVenueStore();
    const [venueDropdownOpen, setVenueDropdownOpen] = React.useState(false);
    const router = useRouter();

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Popover open={venueDropdownOpen} onOpenChange={setVenueDropdownOpen}>
                            <PopoverTrigger asChild>
                                <div className="w-full flex items-center justify-center">
                                    <Button variant="outline" role="combobox" aria-expanded={venueDropdownOpen} className="flex justify-between w-full text-center" >
                                        <div className="" />
                                        {selectedVenue?.id
                                            ? venues.find((venue) => venue.id === selectedVenue.id)?.name.toString()
                                            : "Select Venue..."}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandList>
                                        <CommandEmpty>No Venues found</CommandEmpty>
                                        <CommandGroup>
                                            {venues.map((venue) => (
                                                <CommandItem
                                                    key={venue.id}
                                                    value={venue.id.toString()}
                                                    onSelect={(currentValue) => {
                                                        const selected = venues.find(v => v.id.toString() === currentValue)
                                                        if (selected) {
                                                            setSelectedVenue(selected)
                                                        };
                                                    }}
                                                >
                                                    {venue.name}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            selectedVenue?.id === venue.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel> Events </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => router.push("/admin/desktop/events")}>
                                    All Events
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => router.push("/admin/desktop/create-event")}>
                                    Create Event
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t-sidebar-border border">
                Settings
            </SidebarFooter>
        </Sidebar>
    );
};




