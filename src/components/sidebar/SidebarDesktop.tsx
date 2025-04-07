'use client';
import { Plus, Settings, Calendar, CalendarPlus, Check, ChevronsUpDown } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSubItem } from "../ui/sidebar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Venue } from "@prisma/client";
import { Button } from "../ui/button";
import React from "react";
import { useVenueStore } from "@/stores/useVenuestore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"

export default function SidebarDesktop({ venues }: { venues: Venue[] }) {
    const { selectedVenue, setSelectedVenue } = useVenueStore();
    const [venueDropdownOpen, setVenueDropdownOpen] = React.useState(false);
    const router = useRouter();

    return (
        <Sidebar className="border-r shadow-sm">
            <SidebarHeader className="py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Popover open={venueDropdownOpen} onOpenChange={setVenueDropdownOpen}>
                            <PopoverTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    role="combobox" 
                                    aria-expanded={venueDropdownOpen} 
                                    className="flex justify-between w-full text-center font-medium transition-all hover:bg-slate-100"
                                >
                                    {selectedVenue?.id
                                        ? venues.find((venue) => venue.id === selectedVenue.id)?.name.toString()
                                        : "Select Venue..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[220px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search venue..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No venues found</CommandEmpty>
                                        <CommandGroup>
                                            {venues.map((venue) => (
                                                <CommandItem
                                                    key={venue.id}
                                                    value={venue.id.toString()}
                                                    onSelect={(currentValue) => {
                                                        const selected = venues.find(v => v.id.toString() === currentValue)
                                                        if (selected) {
                                                            setSelectedVenue(selected)
                                                            setVenueDropdownOpen(false)
                                                        };
                                                    }}
                                                    className="flex items-center"
                                                >
                                                    {venue.name}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
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
                                    onClick={() => router.push("/admin/desktop/create-event")}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium transition-all hover:bg-slate-100 rounded-md"
                                >
                                    <CalendarPlus className="h-4 w-4" />
                                    Create Event
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t p-3">
                <Button variant="ghost" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
};




