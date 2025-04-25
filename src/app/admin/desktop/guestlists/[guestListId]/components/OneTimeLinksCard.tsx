'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import NumberDropdown from "@/components/ui/custom/number-dropdown"
import CopyInput from "@/components/ui/custom/input-clipboard"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { GuestListWithDetails, Link } from "@/types/event-types"
import { createOneTimeLink, createToken, getLinksByGuestlistId } from "@/actions/link-actions"
import { Copy, LockIcon, Circle, Minus } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { OneTimeLinkFormValues, oneTimeLinkSchema } from "@/form-schemas/event-forms"
import { useSession } from "next-auth/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"

function createLink(token: string) {
    return `http://localhost:3000/public/onetimelink?token=${token}`
}

function CopyButton({ linkId }: { linkId: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const result = await createToken({ linkId });
        if (result.error) {
            toast.error(result.error.message);
            return;
        }
        try {
            await navigator.clipboard.writeText(createLink(result.data));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
            toast.error('Failed to copy link');
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="p-1 text-gray-500 hover:text-black"
            title={copied ? 'Copied!' : 'Copy to clipboard'}
            type="button"
        >
            <Copy size={18} />
        </button>
    )
}

export default function OneTimeLinksCard({ guestlist }: { guestlist: GuestListWithDetails }) {
    const [filter, setFilter] = useState<boolean>(false);
    const [links, setLinks] = useState<Link[]>([]);
    const [newLink, setNewLink] = useState<string>("");
    const { data: session } = useSession();

    const defaultName = `tempLink-${guestlist.name.replaceAll(" ", "-")}-@${guestlist.event.name}`;

    const form = useForm<OneTimeLinkFormValues>({
        resolver: zodResolver(oneTimeLinkSchema),
        defaultValues: {
            name: defaultName,
            slots: 1,
            plusOne: true,
            needsConfirmation: true,
        }
    });

    const nameValue = useWatch({
        control: form.control,
        name: "name"
    });

    const isNameCustomized = nameValue !== defaultName;

    useEffect(() => {
        async function fetchLinks() {
            const result = await getLinksByGuestlistId(guestlist.id);
            if (result.error) {
                toast.error(result.error.message);
                return;
            }
            setLinks(result.data);
        }
        fetchLinks();
    }, [guestlist.id, newLink])

    const onSubmit = async (values: OneTimeLinkFormValues) => {
        if (!session?.user?.id) {
            toast.error("Not authenticated");
            return;
        }

        const linkResult = await createOneTimeLink({
            guestlistId: guestlist.id,
            name: values.name,
            capacity: values.slots,
            plusOne: values.plusOne,
            needsConfirmation: values.needsConfirmation,
            createdByUserId: session.user.id
        });

        if (linkResult.error) {
            toast.error(linkResult.error.message);
            return;
        }

        const tokenResult = await createToken({ linkId: linkResult.data.id });
        if (tokenResult.error) {
            toast.error(tokenResult.error.message);
            return;
        }

        setNewLink(createLink(tokenResult.data));
        toast.success("Link created successfully");
    }

    return (
        <Card className="flex-1 max-w-1/2">
            <CardHeader>
                <div className="flex justify-between">
                    <CardTitle>One Time Links ({links.length})</CardTitle>
                    <Button variant="outline" onClick={() => setFilter(!filter)}>{`Show ${filter ? "all" : "active"}`}</Button>
                </div>
            </CardHeader>
            <CardContent>
                {links.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No links created yet</div>
                ) : (
                    <div className="h-[300px] overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted/20 [&::-webkit-scrollbar-thumb]:bg-muted/40 [&::-webkit-scrollbar-thumb]:rounded-md hover:[&::-webkit-scrollbar-thumb]:bg-muted/60">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background z-10">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-1/12">Active</TableHead>
                                    <TableHead className="w-2/12">Name</TableHead>
                                    <TableHead className="w-1/12">Slots</TableHead>
                                    <TableHead className="w-[5%]">+1</TableHead>
                                    <TableHead className="w-[5%]">Confirm</TableHead>
                                    <TableHead className="w-1/12">Link</TableHead>
                                    <TableHead className="w-1/12">Lock</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="overflow-y-auto">
                                {links.map((link) => (
                                    <TableRow key={link.id}>
                                        <TableCell>
                                            <div className={`px-2 py-1 text-xs rounded-full w-fit ${link.active ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {!link.active ? 'active' : 'used'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="truncate max-w-[150px]">
                                                            {link.name}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{link.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell>{link.capacity}</TableCell>
                                        <TableCell className="text-center">
                                            {link.plusOne ? (
                                                <Circle className="h-2 w-2 mx-auto text-foreground/60 fill-foreground/60" />
                                            ) : (
                                                <Minus className="h-2 w-2 mx-auto text-foreground/60" />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {link.needsConfirmation ? (
                                                <Circle className="h-2 w-2 mx-auto text-foreground/60 fill-foreground/60" />
                                            ) : (
                                                <Minus className="h-2 w-2 mx-auto text-foreground/60" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center w-full">
                                                <CopyButton linkId={link.id} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button variant="ghost">
                                                <LockIcon className="text-right" size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
            <CardFooter className="block">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col border rounded-lg p-2 gap-y-2">
                        <div className="flex gap-x-2 items-center">
                            <Button type="submit" variant="default">Create One Time Link</Button>
                            <div className="flex-1">
                                <CopyInput value={newLink} placeholder={newLink} />
                            </div>
                        </div>
                        <div className="flex gap-x-2 justify-between items-center">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                placeholder={defaultName}
                                                value={isNameCustomized ? field.value : ""}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slots"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <NumberDropdown
                                                selected={field.value}
                                                setSelected={(value) => field.onChange(value)}
                                                placeholder="Select Slots"
                                                width={80}
                                                size={15}
                                                prefix="Slots"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="plusOne"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center border border-input rounded-md p-1 px-2">
                                            <FormControl>
                                                <Checkbox
                                                    id="plusOne"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <label htmlFor="plusOne" className="pl-1">+1</label>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="needsConfirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center border border-input rounded-md p-1 px-2">
                                            <FormControl>
                                                <Checkbox
                                                    id="needsConfirmation"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <label htmlFor="needsConfirmation" className="pl-1">Confirm</label>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
            </CardFooter>
        </Card>
    )
}
