import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { UIMessage } from 'ai';

export const runtime = 'edge';

export const POST  = async (req: Request) => {
    const {chatId} = await req.json();
    const _messages = await db.select().from(messages).where(eq(messages.chatId, chatId));

    // format the flat database messages to structured UIMessage[] format
    const uiMessages = _messages.map(message => ({
        id: message.id.toString(),
        role: message.role as 'user' | 'assistant',
        parts: [{
            type: 'text',
            text: message.content,
        }]
    }));

    return NextResponse.json(uiMessages as UIMessage[]);
}