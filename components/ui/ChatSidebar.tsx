import { DrizzleChat } from "@/lib/db/schema"
import { MessageCircle, PlusCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "./Button"
import { cn } from "@/lib/utils"

type props = {
    chats: DrizzleChat[],
    chatId: number //current chatId
}

export default function ChatSidebar({ chats, chatId}: props){
    return (
        <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
            <Link href={'/'}>
                <Button className="w-full border border-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-700">
                    <PlusCircle className="mr-1 w-4 h-4" />
                    New Chat
                </Button>
            </Link>

            <div className="flex flex-col gap-2 mt-4">
                {chats.map((chat) => 
                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                        <div 
                            className={cn("rounded-lg text-slate-300 flex items-center p-3",
                                {"bg-blue-500 text-white": chat.id === chatId},
                                {"hover:text-white": chat.id !== chatId})}
                        >
                            <MessageCircle className="mr-1 w-4 h-4" />
                            <p className="w-full text-xs truncate">{chat.pdfName}</p>
                        </div>
                    </Link>
                )}
            </div>

            <div className="absolute bottom-4 left-4">
                <div className="flex items-center flex-wrap gap-2 text-slate-400 text-sm">
                    <Link href={'/'} className="hover:text-slate-300">Home</Link>
                    <Link href={'/'} className="hover:text-slate-300">Source</Link>
                    {/* Stripe Button */}
                </div>
            </div>
        </div>
    )
}

