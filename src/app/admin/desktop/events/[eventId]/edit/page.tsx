import React from "react"
import EditEvent from "./EditEvent";
import { getEventById } from "@/actions/event-actions";

type Props = {
    params: {
        eventId: string;
    }
}

export default async function Page({ params }: Props) {
    const event = await getEventById(Number(params.eventId));

    if (!event) {
        return <div>Event not found</div>;
    }

    return <EditEvent event={event} />;
}
