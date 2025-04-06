import { prisma } from "@/lib/prisma";
import SidebarClient from "./SidebarDesktop";


export default async function() {
    const venues = await prisma.venue.findMany({});
    return (
    <SidebarClient venues={venues}/>
    )

}
