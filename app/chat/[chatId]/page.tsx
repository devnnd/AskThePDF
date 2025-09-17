import ChatSidebar from "@/components/ChatSidebar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import PDFViewer from "@/components/PDFViewer";
import ChatComponent from "@/components/ChatComponent";

type props = {
    params: {
        chatId: string
    }
}

export default async function GET(props: props) {
    const {chatId} = await props.params;
    const {userId} = await auth();
    if(!userId){
        return redirect('/sign-in');
    }

    const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
    if(!_chats){
        return redirect('/');
    }
    if(!_chats.find((chat) => chat.id === parseInt(chatId))){
        return redirect('/');
    }

    const currentChat = _chats.find(chat => chat.id === parseInt(chatId));

    return (
        <div className="flex max-h-screen">
            <div className="flex w-full max-h-screen">
                {/* Chat sidebar */}
                <div className="flex-[2] max-w-xs min-w-0">
                    <ChatSidebar chats={_chats} chatId={parseInt(chatId)}/>
                </div>
                {/* PDF viewer */}
                <div className="flex-[5] max-h-screen p-4">
                    <PDFViewer pdfUrl={currentChat?.pdfUrl}/>
                </div>
                {/* Chat component */}
                <div className="flex-[3] border-l-4 border-l-slate-200">
                    <ChatComponent chatId={parseInt(chatId)}/>
                </div>
            </div>
        </div>
    )
}