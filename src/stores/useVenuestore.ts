import { Venue } from '@/types/event-types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

type VenueStore = {
    selectedVenue: Venue | null
    setSelectedVenue: (venue: Venue) => void
}

export const useVenueStore = create<VenueStore>()(
    persist(
        (set, get) => ({
            selectedVenue: null,
            setSelectedVenue: (venue) => set({ selectedVenue: venue })
        }),
        {
            name: "venue-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
)
