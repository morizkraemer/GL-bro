import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useVenueStore } from "@/stores/useVenuestore"
import { Venue } from "@/types/event-types"
import { usePathname } from "next/navigation"
import { Check, ChevronsUpDown } from "lucide-react"
import React from "react"

const VenueDropdown = ({venues}: {venues: Venue[]}) => {
    const { selectedVenue, setSelectedVenue } = useVenueStore();
    const [venueDropdownOpen, setVenueDropdownOpen] = React.useState(false);
    const pathname = usePathname();

    const isViewingSpecificEvent = Boolean(pathname?.match(/^\/admin\/desktop\/events\/\d+$/));
    const hasSingleVenue = venues.length === 1;

    return (
        <>
            {hasSingleVenue ? (
                <div className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium bg-secondary/40 rounded-md">
                    {venues[0].name}
                </div>
            ) : (
                <Popover open={venueDropdownOpen} onOpenChange={setVenueDropdownOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={venueDropdownOpen}
                            className={cn(
                                "flex justify-between w-full text-center font-medium transition-all",
                                isViewingSpecificEvent ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-100"
                            )}
                            disabled={isViewingSpecificEvent}
                        >
                            {selectedVenue?.id
                                ? venues.find((venue) => venue.id === selectedVenue.id)?.name.toString()
                                : "Select Venue..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    {!isViewingSpecificEvent && (
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
                    )}
                </Popover>
            )}
        </>
    )
}
export default VenueDropdown
