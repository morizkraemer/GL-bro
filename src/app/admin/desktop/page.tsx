'use client'
import { useVenueStore } from "@/stores/useVenuestore"


export default function() {
    const { selectedVenue, setSelectedVenue } = useVenueStore();

    return (
        <div>
            {selectedVenue ? `Venue: ${selectedVenue.name}` : "No Venue selected"}
        </div>
    )
}
