import React from "react"
import EditEvent from "./EditEvent";
import { getEventById } from "@/actions/event-actions";

type Props = {
    params: {
        eventId: string;
    }
}

export default async function Page({ params }: Props) {
    const { error, data: event } = await getEventById(Number(params.eventId));
    if (error) {
        if (error.code === "missingResource") {
            return <div>{error.message}</div>
        } else {
            return <div>Something went wrong</div>
        }
    }

    return <EditEvent event={event} />;
}

