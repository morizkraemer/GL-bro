// Base types
export interface Event {
    id: number;
    name: string;
    venueId: number;
    eventDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Venue {
    id: number;
    name: string;
    address?: string | null;
    capacity: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface GuestList {
    id: number;
    name: string;
    eventId: number;
    maxCapacity: number | null;
    closed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Guest {
    id: number;
    name: string;
    email: string;
    guestListId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

// API response types
export interface EventWithVenue extends Event {
    venue: Venue;
}

export interface EventWithDetails extends Event {
    venue: Venue;
    guestLists: GuestList[];
    createdByUser: User; 
}

export interface GuestListWithDetails extends GuestList {
    guests: Guest[];
    event: EventWithVenue;
    createdByUser: User;
}

// Form types
export interface GuestListFormValues {
    id?: number;
    name: string;
    maxCapacity: number;
}

export interface EventFormValues {
    eventName: string;
    eventDateTime: Date;
    venueId: number;
    guestLists: GuestListFormValues[];
}
