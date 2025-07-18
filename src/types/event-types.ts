import { Link, User, Event, Venue, GuestList, Guest, Prisma } from "@prisma/client";
// Base types
export type {Link, User, Event, Venue, GuestList, Guest}; 


// API response types
export type EventWithVenue = Prisma.EventGetPayload<{
    include: {
        venue: true
    }
}>

export type EventWithDetails = Prisma.EventGetPayload<{
        include: {
            venue: true,
            guestLists: {
                include: {
                    guests: true
                }
            },
            createdByUser: true,
        },
}>

export type GuestListWithGuests = Prisma.GuestListGetPayload<{
    include: {
        guests: true
    }
}>

export type GuestListWithDetails = Prisma.GuestListGetPayload<{
        include: {
            event: {
                include: {
                    venue: true,
                    createdByUser: true
                },
            },
            guests: true,
            createdByUser: true
        },
}>

export type LinkWithDetails = Prisma.LinkGetPayload<{
  include: {
    GuestList: {
      include: {
        event: {
          include: {
            venue: true
          }
        },
        guests: true
      }
    }
  }
}>

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
