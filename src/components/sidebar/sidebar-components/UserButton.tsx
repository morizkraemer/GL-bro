import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function UserButton() {
    const { status, data: session } = useSession();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{status === "authenticated" ? session.user?.name : ""}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 my-3">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link href="/admin/desktop/profile"><Button variant="ghost" className="h-4 w-full">Profile</Button></Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/admin/desktop/profile/account-settings"><Button variant="ghost" className="h-4 w-full">Account Settings</Button></Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Button variant="ghost" className="h-4 w-full" onClick={() => signOut()}>Sign out</Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
