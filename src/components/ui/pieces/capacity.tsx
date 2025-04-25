import { GuestListWithDetails } from "@/types/event-types";
import { Users } from "lucide-react";

export default function CapacityComponent({ guestList, long }: { guestList: GuestListWithDetails, long: boolean }) {
    const guestCount = guestList.guests.length;
    const capacityPercentage = guestList.maxCapacity
        ? Math.min(100, Math.round((guestCount / guestList.maxCapacity) * 100))
        : 0;

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                {long && <span className="font-medium">Capacity:</span>}
                <div className="relative inline-block min-w-fit">
                    <span className="invisible">99/99 (100%)</span>
                    <span className="absolute left-0">
                        {guestCount} / {guestList.maxCapacity || 'Unlimited'}
                        {guestList.maxCapacity && (
                            <span className="ml-2">({capacityPercentage}%)</span>
                        )}
                    </span>
                </div>
            </div>
            {guestList.maxCapacity && (
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${capacityPercentage}%` }}
                    />
                </div>
            )}
        </div>
    )
}
