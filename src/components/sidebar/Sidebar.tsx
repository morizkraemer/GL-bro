import SidebarClient from "./SidebarDesktop";
import { getVenues } from "@/actions/venue-actions";

export default async function() {
    const { error, data } = await getVenues();
    if (error) {
        switch (error.code) {
            case "internal": {
                throw new Error("Something went wrong")
            }
        }
    } else {
        return (
            <SidebarClient venues={data} />
        )
    }

}
